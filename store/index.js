import { createStore } from 'vuex'
const store = createStore({
	state: {
		hasLogin: false,
		isUniverifyLogin: false,
		loginProvider: "",
		openid: null,
		phonenumber:null,
		testvuex: false,
		colorIndex: 0,
		sessionid:null,
		colorList: ['#FF0000', '#00FF00', '#0000FF'],
		noMatchLeftWindow: true,
		active: 'componentPage',
		leftWinActive: '/pages/component/view/view',
		activeOpen: '',
		menu: [],
		currentUser:null,
		userlist:[],
		univerifyErrorMsg: ''
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setSessionid(state,sessionid){
			state.sessionid=sessionid;
		},
		setCurrentUser(state,user){
			state.currentUser=user;
		},
		setUserList(state,list){
			state.userlist=list;
		},
		setTestTrue(state) {
			state.testvuex = true
		},
		setTestFalse(state) {
			state.testvuex = false
		},
		setColorIndex(state, index) {
			state.colorIndex = index
		},
		setMatchLeftWindow(state, matchLeftWindow) {
			state.noMatchLeftWindow = !matchLeftWindow
		},
		setActive(state, tabPage) {
			state.active = tabPage
		},
		setLeftWinActive(state, leftWinActive) {
			state.leftWinActive = leftWinActive
		},
		setActiveOpen(state, activeOpen) {
			state.activeOpen = activeOpen
		},
		setMenu(state, menu) {
			state.menu = menu
		},
		setUniverifyLogin(state, payload) {
			typeof payload !== 'boolean' ? payload = !!payload : '';
			state.isUniverifyLogin = payload;
		},
		setUniverifyErrorMsg(state,payload = ''){
			state.univerifyErrorMsg = payload
		}
	},
	getters: {
		currentColor(state) {
			return state.colorList[state.colorIndex]
		}
	},
	actions: {
		// lazy loading openid
		getOpenId:function(state) {
			return state.openid;
		},
		setOpenid:function(context,payload){
			context.commit("setOpenid",payload.openid);
		},
		setSessionid:function(context,sessionid){
			context.commit("setSessionid",sessionid);
		},
		getPhoneNumber: function(state ) {
			 return state.phonenumber;
		}
	}
})

export default store
