const nav = require('./nav/nav')
const sidebars = require('./sidebar/index') // 加载所有的sidebars

console.log(__dirname, 'dirname');
module.exports = {
	// base: '/my_blog/',
	dest: 'public',
	title: '白糖炒栗子de前端Blog',
	keywords: '白糖炒栗子, LSKReno, Half Town, 前端路上',
	description: '白糖炒栗子哒前端Blog',
	serviceWorker: true,
	head: [
		['link', {
			rel: 'icon',
			href: '/favicon.ico'
		}],
		['link', {
			rel: 'mainfest',
			href: '/mainfest.json'
		}],
		['script', {
			type: "text/javascript",
			src: "https://s4.cnzz.com/z_stat.php?id=1279144299&web_id=1279144299"
		}, ``]
	],
	port: 80,
	markdown: {
		lineNumbers: false,
	},
	plugins: [
		['copy-code', {
			copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
			copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
			duration: 1500, // prompt message display time.
			showInMobile: false // whether to display on the mobile side, default: false.
		}],
		["@vuepress/back-to-top", true],
		// [
		// 	'@vuepress/google-analytics',
		// 	{
		// 		'ga': 'UA-00000000-0' // UA-00000000-0
		// 	},
		// ],
		[
			"vuepress-plugin-medium-zoom",
			{
				options: {
					margin: 24,
					background: "white",
					scrollOffset: 0
				}
			}
		],
		[
			"@vuepress/pwa",
			{
				serviceWorker: true,
				updatePopup: {
					message: "博客内容有更新，点击刷新立即查看新内容。",
					buttonText: "刷新"
				}
			}
		]
	],
	serviceWorker: true, // 是否开启 PWA
	themeConfig: {
		smoothScroll: true,
		// algolia: {
		// 	apiKey: '<API_KEY>',
		// 	indexName: '<INDEX_NAME>'
		// },
		nav: nav,
		sidebar: [
			sidebars.catalog_sidebar,
			// {
			// 	title: '总结前端技术文章', // 必要的
			// 	// path: '/about/',      // 可选的, 应该是一个绝对路径
			// 	collapsable: true, // 可选的, 默认值是 true,
			// 	sidebarDepth: 2, // 可选的, 默认值是 1
			// 	children: [
			// 		'/good-summary/',
			// 	]
			// },
			sidebars.html_sidebar,
			sidebars.css_sidebar,
			sidebars.javascript_sidebar,
			sidebars.es6_11_sidebar,
			sidebars.deep_in_js_sidebar,
			sidebars.browser_sidebar,
			sidebars.js_api_sidebar,
			// sidebars.network_tcp_sidebar,
			sidebars.interview_sidebar,
			sidebars.js_hand_sidebar,
			// sidebars.vue_sidebar,
			sidebars.koa_sidebar,
			sidebars.mongodb_sidebar,
			sidebars.optimization_sidebar,
			sidebars.js_design_pattern_sidebar,
			sidebars.frontend_security_sidebar,
			sidebars.framework_design_sidebar,
			sidebars.module_standard_sidebar,
			sidebars.common_sidebar,
			sidebars.os_sidebar,
			// sidebars.automated_test_sidebar,
			sidebars.vue_cli_sidebar,
			{
				title: '关于', // 必要的
				// path: '/about/',      // 可选的, 应该是一个绝对路径
				collapsable: true, // 可选的, 默认值是 true,
				sidebarDepth: 2, // 可选的, 默认值是 1
				children: [
					'/about/'
				]
			},
		],
		sidebarDepth: 2,
		lastUpdated: '最后更新时间',
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@images': '../images/',
			}
		}
	}
}
