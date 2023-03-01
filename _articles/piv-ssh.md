---
title: "macOS PIV to SSH key extraction"
layout: article
category: Development
subcategory: References
---

## Use PIV certs for SSH using native macOS smartcard drivers
```bash
export OSXSC_LIB=/usr/lib/ssh-keychain.dylib
ssh-add -s $OSXSC_LIB
```

Export all public keys:

```bash
ssh-keygen -D $OSXSC_LIB -e
```

You will get multiple public keys as output. Provide just one of the public keys with your email address appended at the end of the string preceding it with a `space` and send it via Slack or Gmail to our DevOps team so they can update the ssh authorized_keys

A Sample Public Key String Output *(this data has been altered to render it useless)*
```
ssh-rsa AAAAB3NzaC1yc2XBSHSHDAQABAAABAQC6RmDp+9wABDS3yfurkjLpcbdWDxG9SnL4424mg+0czzPDX3hNLs0ON9rPQg0hUTi1VeX3jXgf7vxRQ9Riz
7kXxv9mhU+dxC0ywo13lZgie1lPnxyCOOKmouN0Qkep4bxFTP3s5VSVyOpLGzJr7alpK3h5wUzbIt4bFpnjP0mmuHGmInOlC+yzLbm568kts0sVlii
X3JhJ/8W7UXecje6NY57ujn71fBWv8Iat935jaMf2EGarPa+VRjaNpiE^^%$$#IeolxTktLufdhztnh0sPBAbEtYoJNpwz5N9osSezFOYw5DnRfORl
MptwfZOnBMZzCwCL6ttuT63M5G5Kz+N email_namespace@gsa.gov
```

## PIV card discipline
We should all strive to remove our PIV cards from the readers when we aren't around.  Otherwise somebody who has compromised the machine might be able to try a lot of PINs (or sniff yours from the keyboard when you auth) and be able to use it while we are not around.  Also:  consider keeping your card reader visible so that you can see when it's being used.  If you see the reader blinking (mine blinks when you are doing auth, yours may be different) while you aren't doing ssh stuff, it might be such an attack taking place.  Remove your card and get help.

Remember that your PIV card is a critical security device.  It is YOU.  If it is lost/stolen, be sure to follow the procedures here:  <https://www.gsa.gov/portal/category/107211#m>

## MacOS SmartCard Pairing

If you plug your PIV into your mac and see a dialog that looks like this, *do not pair it*. You should click **Do not show again**.

![macOS SmartCard Pairing Dialog]({{site.baseurl}}/images/piv-macos-dialog.png)

This will not affect devops things, however it will bind your MacOS local user identity with the smart card credential, so when the PIV is in the reader, you will have to enter the PIN to complete authentication.

## References
- <http://security.stackexchange.com/questions/104293/use-hspd-12-piv-keys-for-ssh>
- <https://developers.yubico.com/yubico-piv-tool/SSH_with_PIV_and_PKCS11.html>
- <https://ludovicrousseau.blogspot.com/2014/03/level-1-smart-card-support-on-mac-os-x.html>
- <https://resources.jamf.com/documents/technical-papers/macos-smart-card-overview.pdf>
- <https://piv.idmanagement.gov/engineering/ssh/#ssh-from-macos>

## Troubleshooting

### Possible error messages from the connection

```
no such identity: /Users/USERNAME/.ssh/id_ecdsa: No such file or directory
no such identity: /Users/USERNAME/.ssh/id_ed25519: No such file or directory
```

- [(more example error messages)](https://bbs.archlinux.org/viewtopic.php?id=160388)

In this instance these errors usually indicate that the smartcard is not readable or some SC drivers are missing.
