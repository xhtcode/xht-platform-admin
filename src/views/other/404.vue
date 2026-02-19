<script lang="ts" setup>
defineOptions({ name: '404ViewIndex' })

// 返回首页的方法
const goHome = () => {
  window.location.href = '/'
}
</script>

<template>
  <div class="not-found-page">
    <div class="content">
      <h1 class="title">404</h1>
      <p class="description">抱歉，您访问的页面不存在。</p>
      <button class="home-button" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; // 背景色
  text-align: center;

  .content {
    max-width: 500px;
    padding: 20px;

    .title {
      font-size: 100px;
      color: #ff6b6b; // 醒目的红色
      margin: 0;
      font-weight: bold;
    }

    .description {
      font-size: 20px;
      color: #666;
      margin: 20px 0;
    }

    .home-button {
      padding: 12px 24px;
      font-size: 16px;
      color: white;
      background-color: #007bff; // 蓝色按钮
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3; // 悬停变深蓝
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .not-found-page {
    .content {
      .title {
        font-size: 60px;
      }

      .description {
        font-size: 16px;
      }

      .home-button {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  }
}
</style>
