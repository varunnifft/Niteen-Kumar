# Learning Module — Android app (test build)

Offline Android app (WebView) covering blast furnace, sinter, coke oven, pellet, lime calcination and oxygen plants, with 3D animated models, by Niteen Kumar (MBF).

- App content: `app/src/main/assets/index.html`
- Every push to branch `bf-training-academy-apk` builds the APK on GitHub Actions and publishes it under **Releases** as a pre-release.
- Signed with a test key (`app/test-signing.keystore`, password `android`) so test builds install as updates over each other. Use your own release key for Play Store.

Content is general educational material; plant interlocks, limits and procedures must come from the plant's approved documents.
