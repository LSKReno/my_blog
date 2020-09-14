<template>
  <div>
    <div v-for="series in posts">
      <!-- 系列文章名称 -->
      <p class="header">{{series.title}}</p>
      <!-- 系列文章内容 -->
      <div class="content">
        <!-- 每篇文章 -->
        <div class="post" v-for="postPath in series.children">
          <a :href="postPath">
            <div
              class="post-wrapper"
              v-for="(page, index) in $site.pages"
              v-if="postPath===$site.pages[index].regularPath"
            >
              <!-- 文章图片 -->
              <img class="post-img" src="../public/logo.jpg" />
              <div class="post-title">{{$site.pages[index].title}}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html_sidebar from "../sidebar/html";
import css_sidebar from "../sidebar/css";
import es6_11_sidebar from "../sidebar/es6-11";
import deep_in_js_sidebar from "../sidebar/deep-in-js";
import browser_sidebar from "../sidebar/browser";
import js_api_sidebar from "../sidebar/js-api";
import network_tcp_sidebar from "../sidebar/network-tcp";
import interview_sidebar from "../sidebar/interview";
import framework_design_sidebar from "../sidebar/framework-design";
import js_hand_sidebar from "../sidebar/js-hand";
import vue_sidebar from "../sidebar/vue";
import koa_sidebar from "../sidebar/koa";
import mongodb_sidebar from "../sidebar/mongodb";
import js_design_pattern_sidebar from "../sidebar/js-design-pattern";
import os_sidebar from "../sidebar/os";
import vue_cli_sidebar from "../sidebar/vue-cli";
import frontend_security_sidebar from "../sidebar/frontend-security";
import automated_test_sidebar from "../sidebar/automated-test";
import module_standard_sidebar from "../sidebar/module-standard";
import datav_sidebar from "../sidebar/datav";
import common_sidebar from "../sidebar/common";
import optimization_sidebar from "../sidebar/optimization";
import error_handler_sidebar from "../sidebar/error-handler";

export default {
  data() {
    return {
      defaultBg:
        "https://lskreno.oss-cn-beijing.aliyuncs.com/vuepress%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0bg/logo.jpg",
      posts: [
        html_sidebar,
        css_sidebar,
        es6_11_sidebar,
        deep_in_js_sidebar,
        browser_sidebar,
        js_api_sidebar,
        // network_tcp_sidebar,
        interview_sidebar,
        framework_design_sidebar,
        js_hand_sidebar,
        vue_sidebar,
        koa_sidebar,
        mongodb_sidebar,
		optimization_sidebar,
		error_handler_sidebar,
        js_design_pattern_sidebar,
        frontend_security_sidebar,
		module_standard_sidebar,
		datav_sidebar,
		common_sidebar,
        os_sidebar,
        automated_test_sidebar,
        vue_cli_sidebar
      ]
    };
  }
};
</script>

<style scoped>
.header {
  font-size: 3vh;
  font-weight: bold;
}
.content {
  display: inline-flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}
/* 网页端720px以上 */
@media screen and (min-width: 720px) {
  .post {
    justify-content: center;
    width: 20vh;
    height: 16vh;
    border-radius: 15px;
    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
    background: #9eccab;
    padding: 5px;
    margin: 5px 10px;
  }
  .post-img {
    width: 10vh;
    height: 10vh;
  }
  .post-title {
    font-size: 1.5vh;
    color: #f2f2f2;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/* 移动端720px以下 */
@media screen and (max-width: 720px) {
  .post {
    justify-content: center;
    width: 9.7vh;
    height: 8vh;
    border-radius: 15px;
    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
    background: #9eccab;
    padding: 5px;
    margin: 5px 10px;
  }
  .post-img {
    width: 4vh;
    height: 4vh;
  }
  .post-title {
    font-size: 1.3vh;
    color: #f2f2f2;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.post:hover {
  background: #9fa39a;
  transform: scaleX(1.2) scaleY(1.1);
  transition: 0.5s all;
}
.post-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
