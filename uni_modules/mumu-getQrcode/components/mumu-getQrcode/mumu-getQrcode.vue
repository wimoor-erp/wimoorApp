<template>
	<view class="canvasBox">
		<template v-if="isUse">
			<view class="box">
				<view class="line"></view>
				<view class="angle"></view>
			</view>
			<view class="box2" v-if="isUseTorch">
				<view class="track" @click="openTrack">
					<svg
						t="1653920715959"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="1351"
						width="32"
						height="32"
					>
						<path
							d="M651.353043 550.479503H378.752795L240.862609 364.315031c-3.688944-4.897391-5.660621-10.876025-5.660621-17.045466v-60.040745c0-15.773416 12.847702-28.621118 28.621118-28.621118h502.459627c15.773416 0 28.621118 12.847702 28.621118 28.621118v59.977143c0 6.105839-1.971677 12.084472-5.660621 17.045466l-137.890187 186.228074zM378.752795 598.308571v398.024348c0 15.328199 12.402484 27.667081 27.667081 27.667081h217.266087c15.328199 0 27.667081-12.402484 27.66708-27.667081V598.308571H378.752795z m136.300124 176.942112c-14.564969 0-26.331429-11.76646-26.331428-26.331428v-81.283975c0-14.564969 11.76646-26.331429 26.331428-26.331429 14.564969 0 26.331429 11.76646 26.331429 26.331429v81.283975c0 14.564969-11.76646 26.331429-26.331429 26.331428zM512 222.608696c-17.554286 0-31.801242-14.246957-31.801242-31.801243V31.801242c0-17.554286 14.246957-31.801242 31.801242-31.801242s31.801242 14.246957 31.801242 31.801242v159.006211c0 17.554286-14.246957 31.801242-31.801242 31.801243zM280.932174 205.881242c-9.47677 0-18.889938-4.197764-25.122981-12.275279L158.242981 67.991056a31.864845 31.864845 0 0 1 5.597019-44.648944 31.864845 31.864845 0 0 1 44.648944 5.597018l97.502609 125.551305a31.864845 31.864845 0 0 1-5.597019 44.648944c-5.787826 4.579379-12.656894 6.741863-19.46236 6.741863zM723.987081 205.881242c-6.805466 0-13.674534-2.162484-19.462361-6.678261a31.794882 31.794882 0 0 1-5.597018-44.648944l97.566211-125.551304a31.794882 31.794882 0 0 1 44.648944-5.597019 31.794882 31.794882 0 0 1 5.597019 44.648944l-97.566211 125.551305c-6.360248 8.077516-15.709814 12.27528-25.186584 12.275279z"
							fill="#ffffff"
							p-id="1352"
						></path>
					</svg>
					{{ trackStatus ? '关闭闪光灯' : '打开闪光灯' }}
				</view>
			</view>

			<view class="mask1 mask" :style="'height:' + maskHeight + 'px;'"></view>
			<view
				class="mask2 mask"
				:style="'width:' + maskWidth + 'px;top:' + maskHeight + 'px;height:' + canvasHeight + 'px'"
			></view>
			<view class="mask3 mask" :style="'height:' + maskHeight + 'px;'"></view>
			<view
				class="mask4 mask"
				:style="'width:' + maskWidth + 'px;top:' + maskHeight + 'px;height:' + canvasHeight + 'px'"
			></view>
		</template>
		<template v-else>
			<slot name="error">
				<view class="error">
					<view class="on1">相机权限被拒绝，请尝试如下操作：</view>
					<view>· 刷新页面后重试；</view>
					<view>· 在系统中检测当前App或浏览器的相机权限是否被禁用；</view>
					<view>· 如果依然不能体验，建议在微信中打开链接；</view>
				</view>
			</slot>
		</template>
	</view>
</template>

<script>
import jsQR from 'jsqr'

export default {
	props: {
		continue: {
			type: Boolean,
			default: false // false 监听一次   true 持续监听
		},
		exact: {
			type: String,
			default: 'environment' // environment 后摄像头  user 前摄像头
		},
		size: {
			type: String,
			default: 'whole' // whole 全屏  balf 半屏
		},
		definition: {
			type: Boolean,
			default: false // fasle 正常  true 高清
		}
	},
	data() {
		return {
			windowWidth: 0,
			windowHeight: 0,
			video: null,
			canvas2d: null,
			canvas2d2: null,
			canvasWidth: 200,
			canvasHeight: 200,
			maskWidth: 0,
			maskHeight: 0,
			inter: 0,

			track: null,
			isUseTorch: false,
			trackStatus: false,

			isParse: false,
			isUse: true
		}
	},
	mounted() {
		if (origin.indexOf('https') === -1) throw '请在 https 环境中使用摄像头组件。'

		this.windowWidth = document.documentElement.clientWidth || document.body.clientWidth
		this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
		this.windowHeight = this.size === 'whole' ? this.windowHeight : this.windowHeight / 2
		this.isParse = true

		this.$nextTick(() => {
			this.createMsk()
			this.openScan()
		})
	},
	destroyed() {
		this.closeCamera()
	},
	methods: {
		openScan() {
			const width = this.transtion(this.windowHeight)
			const height = this.transtion(this.windowWidth)
			const videoParam = {
				audio: false,
				video: {
					facingMode: { exact: this.exact },
					width,
					height
				}
			}
			navigator.mediaDevices
				.getUserMedia(videoParam)
				.then(stream => {
					this.video = document.createElement('video')
					this.video.width = this.windowWidth
					this.video.height = this.windowHeight

					const canvas = document.createElement('canvas')
					canvas.id = 'canvas'
					canvas.width = this.transtion(this.canvasWidth)
					canvas.height = this.transtion(this.canvasHeight)
					canvas.style = 'display:none;'
					//canvas.style = 'position: fixed;top: 0;z-index: 999;left:0'
					this.canvas2d = canvas.getContext('2d')

					// 设置当前宽高 满屏
					const canvasBox = document.querySelector('.canvasBox')
					canvasBox.append(this.video)
					canvasBox.append(canvas)
					canvasBox.style = `width:${this.windowWidth}px;height:${this.windowHeight}px;`

					// 创建第二个canvas
					const canvas2 = document.createElement('canvas')
					canvas2.id = 'canvas2'
					canvas2.width = this.canvasWidth
					canvas2.height = this.canvasHeight
					canvas2.style = 'position: absolute;top: 50%;left: 50%;z-index: 20;transform: translate(-50%, -50%);'
					this.canvas2d2 = canvas2.getContext('2d')
					canvasBox.append(canvas2)

					this.video.srcObject = stream
					this.video.setAttribute('playsinline', true)
					this.video.play()
					this.tick()

					this.track = stream.getVideoTracks()[0]
					setTimeout(() => {
						this.isUseTorch = this.track.getCapabilities().torch || null
					}, 500)
				})
				.catch(err => {
					this.isUse = false
					this.$emit('error', err)
				})
		},

		closeCamera() {
			this.isParse = false
			if (this.video && this.video.srcObject) {
				this.video.srcObject.getTracks().forEach(track => {
					track.stop()
				})
			}
		},

		tick() {
			if (!this.isParse) return
			if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
				this.canvas2d.drawImage(
					this.video,
					this.transtion(this.maskWidth),
					this.transtion(this.maskHeight),
					this.transtion(200),
					this.transtion(200),
					0,
					0,
					this.transtion(this.canvasWidth),
					this.transtion(this.canvasHeight)
				)

				const imageData = this.canvas2d.getImageData(
					0,
					0,
					this.transtion(this.canvasWidth),
					this.transtion(this.canvasHeight)
				)

				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: 'dontInvert'
				})

				this.canvas2d2.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
				if (code) {
					this.drawLine(code.location.topLeftCorner, code.location.topRightCorner)
					this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner)
					this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner)
					this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner)
					if (code.data) {
						this.getData(code.data)
					}
				}
			}
			requestAnimationFrame(this.tick)
		},
		drawLine(begin, end, color = '#FF3B58') {
			this.canvas2d2.beginPath()
			this.canvas2d2.moveTo(this.nutranstion(begin.x), this.nutranstion(begin.y))
			this.canvas2d2.lineTo(this.nutranstion(end.x), this.nutranstion(end.y))
			this.canvas2d2.lineWidth = 4
			this.canvas2d2.strokeStyle = color
			this.canvas2d2.stroke()
		},

		getData(data) {
			this.$emit('success', data)
			if (!this.continue) {
				this.closeCamera()
			}
		},

		openTrack() {
			this.trackStatus = !this.trackStatus
			this.track.applyConstraints({
				advanced: [{ torch: this.trackStatus }]
			})
		},

		createMsk() {
			this.maskWidth = this.windowWidth / 2 - this.canvasWidth / 2
			this.maskHeight = this.windowHeight / 2 - this.canvasHeight / 2
		},

		transtion(number) {
			return this.definition ? number * 2.8 : number * 1.8
		},
		nutranstion(number) {
			return this.definition ? number / 2.8 : number / 1.8
		}
	}
}
</script>

<style scoped>
page {
	background-color: #333333;
}

.canvasBox {
	width: 100vw;
	height: 100vh;
	position: relative;

	background-image: linear-gradient(
			0deg,
			transparent 24%,
			rgba(32, 255, 77, 0.1) 25%,
			rgba(32, 255, 77, 0.1) 26%,
			transparent 27%,
			transparent 74%,
			rgba(32, 255, 77, 0.1) 75%,
			rgba(32, 255, 77, 0.1) 76%,
			transparent 77%,
			transparent
		),
		linear-gradient(
			90deg,
			transparent 24%,
			rgba(32, 255, 77, 0.1) 25%,
			rgba(32, 255, 77, 0.1) 26%,
			transparent 27%,
			transparent 74%,
			rgba(32, 255, 77, 0.1) 75%,
			rgba(32, 255, 77, 0.1) 76%,
			transparent 77%,
			transparent
		);
	background-size: 3rem 3rem;
	background-position: -1rem -1rem;
	z-index: 10;
	background-color: #1110;
}

.box {
	width: 200px;
	height: 200px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	overflow: hidden;
	border: 0.1rem solid rgba(0, 255, 51, 0.2);
	z-index: 11;
}

.line {
	height: calc(100% - 2px);
	width: 100%;
	background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
	border-bottom: 3px solid #00ff33;
	transform: translateY(-100%);
	animation: radar-beam 2s infinite alternate;
	animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
	animation-delay: 1.4s;
}

.box:after,
.box:before,
.angle:after,
.angle:before {
	content: '';
	display: block;
	position: absolute;
	width: 3vw;
	height: 3vw;
	z-index: 12;
	border: 0.2rem solid transparent;
}

.box:after,
.box:before {
	top: 0;
	border-top-color: #00ff33;
}

.angle:after,
.angle:before {
	bottom: 0;
	border-bottom-color: #00ff33;
}

.box:before,
.angle:before {
	left: 0;
	border-left-color: #00ff33;
}

.box:after,
.angle:after {
	right: 0;
	border-right-color: #00ff33;
}

@keyframes radar-beam {
	0% {
		transform: translateY(-100%);
	}

	100% {
		transform: translateY(0);
	}
}

.msg {
	text-align: center;
	padding: 20rpx 0;
}

.box2 {
	width: 300px;
	height: 200px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 20;
}

.track {
	position: absolute;
	bottom: -100px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 20;
	color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.mask {
	position: absolute;
	z-index: 10;
	background-color: rgba(0, 0, 0, 0.55);
}

.mask1 {
	top: 0;
	left: 0;
	right: 0;
}

.mask2 {
	right: 0;
}

.mask3 {
	right: 0;
	left: 0;
	bottom: 0;
}

.mask4 {
	left: 0;
}

.error {
	color: #fff;
	padding: 40rpx;
	font-size: 24rpx;
	background-color: #333333;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 550rpx;
	border-radius: 20rpx;
}

.error .on1 {
	font-size: 30rpx;
}
</style>
