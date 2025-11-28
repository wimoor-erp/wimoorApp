## 插件简绍
### 实现原理

> 二维码识别功能使用的是jsQR这个库，调用摄像头使用的 	navigator.mediaDevices.getUserMedia 这个H5的api。通过canvas画布把摄像头获取到的数据展现到页面上，同时循环监听jsQR解析。


### 使用环境
经测试发现大部分浏览器都可以正常使用（微信，QQ，谷歌，火狐，safari），少数的安卓自带浏览器无法使用（浏览器内核版本过低）。需要https环境才能使用，本地测试可以在 manifest.json  中点击源码展示，找到h5 ，添加："devServer" : { "https" : true}

需要https环境才能使用！！！

需要https环境才能使用！！！

需要https环境才能使用！！！

**小知识点：苹果设备上不论什么浏览器都是safari套壳的，不论是谷歌还是火狐都是safari套壳。这也就是代表在苹果上无需担心无法使用此插件。（造成这样的现象是因为苹果有一则协议，浏览器只能使用safari内核）**

在安卓系统上可以打开闪光灯

#### 通过脚手架创建的 uni 项目，需要看这里

如果你是通过脚手架创建的 uni 的项目，需要自行安装 `jsQR` 依赖，并且修改组件中源码中的引入。通过 HBuilder 创建的项目不需要此操作。

```bash
# 安装 jsQR
npm install jsqr --save
# 修改组件源码对 jsQR 依赖
import jsQR from "jsqr"
```



### 插件使用
**插件已支持 uni_modules 支持组件easycom，以下代码演示的是普通使用**

``` html
<!-- HTML -->
	<mumu-get-qrcode @success='qrcodeSucess' @error="qrcodeError" ></mumu-get-qrcode>
```

``` javascript
// js
import mumuGetQrcode from '@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue'
// 嫌路径长的话可以单独复制出来
export default {
		components: {
			mumuGetQrcode
		},
		methods: {
			qrcodeSucess(data) {
				uni.showModal({
					title: '成功',
					content: data,
					success: () => {
						uni.navigateBack({})
					}
				})
			},
      qrcodeError(err) {
        console.log(err)
        uni.showModal({
          title: '摄像头授权失败',
          content: '摄像头授权失败，请检测当前浏览器是否有摄像头权限。',
          success: () => {
            uni.navigateBack({})
          }
        })
      }
		}
	}
```
### 相关API

##### 可传属性（Props）

| 参数       | 说明                                              | 类型    | 默认值      |
| ---------- | ------------------------------------------------- | ------- | ----------- |
| continue   | 是否连续获取。false 监听一次   true 持续监听      | Boolean | false       |
| exact      | 选调用摄像头。environment 后摄像头  user 前摄像头 | String  | environment |
| size       | 扫码屏幕大小。whole 全屏  balf 半屏               | String  | whole       |
| definition | 调用摄像头清晰度。fasle 正常  true 高清           | Boolean | false       |



##### 事件（Events）

| 事件名  | 说明                                       | 回调参数           |
| ------- | ------------------------------------------ | ------------------ |
| success | 检测到图中有二维码并读取到数据是回调       | 二维码数据         |
| error   | 组件内部发送错误，通常是摄像头没有调用成功 | 错误信息，详情见下 |

**常见的错误信息：**

- `AbortError`［中止错误］

  尽管用户和操作系统都授予了访问设备硬件的权利，而且未出现可能抛出`NotReadableError`异常的硬件问题，但仍然有一些问题的出现导致了设备无法被使用。

- `NotAllowedError`［拒绝错误］

  用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。

- `NotFoundError`［找不到错误］

  找不到满足请求参数的媒体类型。

- `NotReadableError`［无法读取错误］

  尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。

- `OverconstrainedError`［无法满足要求错误］

  指定的要求无法被设备满足，此异常是一个类型为`OverconstrainedError`的对象，拥有一个`constraint`属性，这个属性包含了当前无法被满足的`constraint`对象，还拥有一个`message`属性，包含了阅读友好的字符串用来说明情况。

- `SecurityError`［安全错误］

  在`getUserMedia()` 被调用的 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。

- `TypeError`［类型错误］

  constraints 对象未设置［空］，或者都被设置为`false`。



##### 插槽 （slot）

| 插槽名称 | 说明                             | 默认值             |
| -------- | -------------------------------- | ------------------ |
| error    | 当发送错误时，在页面上显示的内容 | 相机权限被拒绝提示 |



### 案例演示

![enter description here](https://h5plugin.mumudev.top/public/getQrcode/qrcode.png)

## 支持作者
![支持作者](https://student.mumudev.top/wxMP.jpg)
