# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/yudai-nkt/switchbot-client/compare/v0.1.0...v0.2.0) (2021-01-06)


### ⚠ BREAKING CHANGES

* `Response` now requires 1 type argument.

### Features

* add IR device support for sendControlCommand ([c773a95](https://github.com/yudai-nkt/switchbot-client/commit/c773a95762141a390e4ac4d33d112644adf5b947))
* add support for scenes ([f418a6c](https://github.com/yudai-nkt/switchbot-client/commit/f418a6c2081abf22d4616432935b9423b508c34b))
* implement getDeviceStatus ([1abb34e](https://github.com/yudai-nkt/switchbot-client/commit/1abb34e30fb07dbc2a1b9ec663f5e21c0314f92a))
* implement sendControlCommand ([b49034f](https://github.com/yudai-nkt/switchbot-client/commit/b49034f5cce54682416fd43c7e235e8ede29858e))
* rename execScene to executeScene ([f0840b8](https://github.com/yudai-nkt/switchbot-client/commit/f0840b81a30f4a55d7fa633f8856449b890b6ee1))


### Bug Fixes

* give a proper definition for error response ([0efb812](https://github.com/yudai-nkt/switchbot-client/commit/0efb81278470e881cda82c9649d1cd19e1ba34f0)), closes [OpenWonderLabs/SwitchBotAPI#17](https://github.com/OpenWonderLabs/SwitchBotAPI/issues/17)

## 0.1.0 (2021-01-02)


### Features

* implement RestClient and its getDeviceList ([f147009](https://github.com/yudai-nkt/switchbot-client/commit/f14700923c98beb747a9de5db473c25ab08d21a1))
