---
title: "Identity Verification FlowPolicy"
description: "FlowPolicy is a lightweight structure used to manage dependencies between
Identity Verification steps"
layout: article
category: AppDev
subcategory: Architecture
---

## Introduction

The FlowPolicy ensures that a user is allowed to be on a given page. The user is
allowed to go back and forward with the browser buttons. If the user submits a step, we clear all
future steps. If the user jumps to an Identity Verification step, we check the idv_session and
current_user to see if they are allowed. If not, we redirect them to the latest step where they
are allowed.

This is how individual Identity Verification controllers implement the FlowPolicy.

## FlowPolicy

[FlowPolicy code](https://github.com/18F/identity-idp/blob/main/app/policies/idv/flow_policy.rb)

FlowPolicy contains a private hash of steps. The new controller's key and step_info need to
be added to the hash. For example: `agreement: Idv::AgreementController.step_info,`

FlowPolicy has three public methods. They are called from helper methods in IdvStepConcern ([see below](#idvstepconcern-methods)) rather than being used directly.

`controller_allowed?` uses the controller's `StepInfo.preconditions` to determine if the user is allowed to visit the given controller.

`info_for_latest_step` returns the `StepInfo` object for the latest step the user is allowed to be on. The `StepInfo` object contains enough information to build a url to redirect the user.

`undo_future_steps_from_controller!` uses the controller's `StepInfo.next_steps` to find all future steps and tail-recursively call `undo_step` on them.

### FlowPolicy specs

[FlowPolicy specs for each step in the flow](https://github.com/18F/identity-idp/blob/b157a242d9362050929e47c4f9fd93ec1cfd8bc6/spec/policies/idv/flow_policy_spec.rb#L150)

When a controller is added to the `steps` hash, add a spec to flow_policy_spec that checks whether the flow policy methods handle that controller correctly. For example:
```
    context 'preconditions for agreement are present' do
      it 'returns agreement' do
        stub_up_to(:welcome, idv_session: idv_session)

        expect(subject.info_for_latest_step.key).to eq(:agreement)
        expect(subject.controller_allowed?(controller: Idv::AgreementController)).to be
        expect(subject.controller_allowed?(controller: Idv::HybridHandoffController)).not_to be
      end
    end
```

## StepInfo

[StepInfo code](https://github.com/18F/identity-idp/blob/main/app/policies/idv/step_info.rb)

Each controller needs a `step_info` class method that returns a `StepInfo` object
with the following fields:
* **key** - a unique key which is a symbol, for example `:agreement`
* **controller** - set this to `self`, which is converted to the full controller "path" by `initialize`, for example
`/idv/agreement`
* **next_steps** - an array of keys of following steps once this step is submitted. Some controllers
only have one. Agreement has
several: `[:hybrid_handoff, :document_capture, :how_to_verify]`. If there is no following step, use
`FlowPolicy::FINAL`, for example in PhoneErrorsController.step_info. It can be tricky to determine
where a step belongs. For example `:request_letter` is in the `next_steps` array for VerifyInfo
because even though it is accessed from the Phone step, the Phone step does not have to be
submitted to reach RequestLetter.
* **preconditions** - a proc with arguments `(idv_session:, user:)` that returns true if a
user is allowed to be on this step. For example, the AgreementController preconditions is set to `idv_session.welcome_visited`, to confirm that the user has completed the Welcome step.
* **undo_step** - a proc with arguments `(idv_session:, user:)` that clears any fields set by
this step. Called from `clear_future_steps!`. For example, the AgreementController undo_step sets `idv_session.idv_consent_given` to nil, since that is the attribute that is set when the Agreement step is submitted.
* **action** - a symbol for the controller action to use if jumping to this step. Defaults to `:show`,
so it is only needed for controllers that use `:new` or `:index`.

### Idv::Session state mural
The implementations of `preconditions` and `undo_step` procs were guided by this [Mural of idv_session
changes](https://app.mural.co/t/loginteamada4499/m/loginteamada4499/1694024611822/03ec0f4abe389ac5eb4eda772fe00de02439e00c?sender=u4b5c802b0baf08d2d7cf2223) during the Identity Verification flow.

## IdvStepConcern methods

[IdvStepConcern methods](https://github.com/18F/identity-idp/blob/4ac61b7c9baa9406abc207a6bb368cbd44a76d9b/app/controllers/concerns/idv_step_concern.rb#L106-L123)

### `confirm_step_allowed`

The new controller should call the `:confirm_step_allowed` before action which implicitly takes
an argument of self. It redirects to `url_for_latest_step` if the current step is not allowed. This might happen if the user jumped directly to a later step via a bookmark.

This general before action replaces specific before actions that check that the previous step is complete, so they can be
deleted. Before actions that check if this step is needed would prevent the back button from 
working, so they should be deleted.

### `clear_future_steps!`

The first line in `#update` (or `#create` for a few controllers) should call `clear_future_steps!`.
When the user submits a step, their session is reset to invalidate all downstream steps. This is
important for security to make sure someone cannot verify one set of data and then change parts
of it afterward.

`clear_future_steps!` looks at `step_info.next_steps` for the current step and calls
`step_info.undo_step` for all future steps, using tail recursion to traverse the tree of steps
and then work back from the end. It does not call `undo_step` for the current step,
because some steps allow editing of information that was already entered.

If a controller starts a background job and then polls until the job is complete, mark the current
step as invalid at the beginning of `#update` or `#create` as well. This happens in
VerifyInfoController and PhoneController.

### `url_for_latest_step`

This method is used to build a redirect for `confirm_step_allowed` when the current step is not allowed. It can also be used directly when a redirect is needed, for example when the user goes to
`/verify`.

## Idv::Session status methods

[Idv::Session code](https://github.com/18F/identity-idp/blob/main/app/services/idv/session.rb)

Idv::Session has methods to invalidate individual steps, mark them complete, or check if they are complete. For example, `invalidate_verify_info_step!`, `mark_verify_info_step_complete!`, and `verify_info_step_complete?`. Prefer using and adding to these rather than checking individual idv_session attributes in the code.

## Controller specs

Add the following controller specs for a new controller.

A spec to confirm that this controller's StepInfo object is valid. Substitute the controller class
for AgreementController.
```
  describe '#step_info' do
    it 'returns a valid StepInfo object' do
      expect(Idv::AgreementController.step_info).to be_valid
    end
  end
```

A spec to confirm that `clear_future_steps!` is called.
```
    it 'invalidates future steps' do
      expect(subject).to receive(:clear_future_steps!)

      put :update, params: params
    end
```

To confirm that certain actions are taken, for example that `idv_session.applicant`
is deleted when DocumentCapture is submitted, add `.and_call_original` to the `clear_future_steps!`
stub and then check the effect on `idv_session`.
```
    it 'invalidates future steps' do
      subject.idv_session.applicant = Idp::Constants::MOCK_IDV_APPLICANT
      expect(subject).to receive(:clear_future_steps!).and_call_original

      put :update
      expect(subject.idv_session.applicant).to be_nil
    end
```

## FlowPolicyHelper

[Code for FlowPolicyHelper](https://github.com/18F/identity-idp/blob/main/spec/support/flow_policy_helper.rb)

Because `url_for_latest_step` stops at the first step whose conditions are not met, controller
specs now have to have `idv_session` fully set up for the step under test. FlowPolicyHelper provides
stubs for idv_session setup.

Use the `stub_up_to`
helper in FlowPolicyHelper with the key of the previous step. For example, 
`stub_up_to(:ssn, idv_session: idv_session)` prepares the session for testing in
verify_info_controller_spec, since Ssn is the previous step.

When you add a new key and controller to FlowPolicy, you may also want to extend FlowPolicyHelper to
set up conditions for that controller.  

## Future Work

We want to make it easier for developers to add and remove steps from the Identity Verification flow. Suggestions welcome!

We want to improve `clear_future_steps!` to make fewer assumptions about having a linear flow of steps.
