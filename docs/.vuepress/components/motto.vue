<template>
  <div>
    <p>
      <strong>Hey mate, Please know that</strong>
    </p>
    <div>{{motto}}</div>
    <div class="seperator"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      motto: "坚持比努力更可怕"
    };
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Halimun";
  src: url(../public/Halimun-W7jn.ttf) format("truetype");
}
@font-face {
  font-family: "Bole";
  src: url(../public/Bole.ttf) format("truetype");
}
p {
  font-family: "Halimun", sans-serif;
  font-size: 16px;
}
div {
  font-family: "Bole", sans-serif;
  font-size: 20px;
  font-weight: bold;
}
.seperator {
  width: 100%;
  border-bottom: solid 1px #eeeeee;
}
</style>
