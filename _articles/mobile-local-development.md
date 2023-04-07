---
title: "Mobile local development"
description: iPhone or Android mobile device for local app development
layout: article
category: "AppDev"
subcategory: "Setup"
---

These instructions will configure your local copy of the identity-idp app to serve web pages over your local computer network &mdash; the wifi in your home or office. You can broadcast the app to a mobile phone or tablet. Both your mobile device and your development computer (your laptop) must be connected to the same wifi network.

The instructions also include steps to view your Android phone's screen on your development computer. For this you will need a USB cable.

## Android

1. In your Android phone, turn on USB debugging. This will allow your development computer to connect to your phone.

   **USB debugging** is a setting the the **Developer options** menu. This menu may be hidden on your phone. It can be revealed with a ["magic tap"](https://developer.android.com/studio/debug/dev-options) on the phone **Build number** 5 times.

2. Find your Local Area Network IP address. On a MacBook, this is available at **System Preferences → Network**. The address may start with `192.168`.

3. To your app's `application.yml` file, add:
```yaml
domain_name: 192.168.x.x:3000
mailer_domain_name: 192.168.x.x:3000
enable_load_testing_mode: true
```
Fill in your actual LAN IP address. The final line creates a **confirm now** link in place of email confirmation.

4. Start your app's local web server with:
```bash
HOST=0.0.0.0 make run-https
```

5. In the Chrome web browser of your development computer, visit `chrome://inspect`

6. Click on **Port forwarding**. For port `8234` enter `0.0.0.0:3000`. Check **Enable port forwarding** and click **Done**. This screenshot illustrates enabling port forwarding on a MacBook:
![Screenshot of port forwarding on a MacBook]({{ site.baseurl }}/images/macos-chrome-port-forwarding-settings.png)

7. Plug your Android phone into your development computer with a USB cable. If you see a message on your phone asking you to **Allow USB debugging** click to allow it.

8. In the Chrome browser on your phone, open a new incognito tab. In the address bar, type in `https://` (don't forget the `s`) followed by your LAN IP and port number (like `https://192.168.x.x:3000`). When you visit this page, you may see a **Your connection is not private** message. Click **Advanced** and **Proceed** to continue. You should then see the sign in screen of the identity-idp app.

9. In the `chrome://inspect` tab on your development computer, you should see a listing of all the tabs open on your phone. Find the item on the list that represents the sign in screen of the identity-idp app. It should be at the top of the list.

10. Click to **inspect** this tab. You should see a representation of your phone's screen on your development computer, as in this illustration:
![Screenshot of inspecting an Android Chrome tab]({{ site.baseurl }}/images/inspect-android-chrome-tab.png)

After you complete these steps, pages from the app are served from your development machine to your Android phone. Your phone's screen is visible on your desktop, giving you access to the browser developer tools and the ability to screen share the phone interface.

## iPhone

The procedure on an iPhone is similar to the Android technique, above. You may use the Safari browser. However:
- You will not be able to view your phone's screen from your development computer's screen

- You will not find a Safari tab within `chrome://inspect`

- You may not need a USB cable nor to activate USB debugging
