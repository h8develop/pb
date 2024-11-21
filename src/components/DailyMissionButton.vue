<!-- HTML !-->
<template>
  <div class="glow">
    <a href="#" class="btn" role="button">
      <!-- <img
        src="https://cdn-icons-png.flaticon.com/512/9592/9592247.png"
        alt=""
        class="-top-20 left-1 w-12 rotate-45"
      /> -->
      <span> Ежедневные миссии </span>
    </a>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Caesar+Dressing&display=swap");

:root {
  --primary: #ff1e92;
  --secondary: #791eff;
}

@-webkit-keyframes cycle-shapes {
  0% {
    -webkit-clip-path: unset;
    clip-path: unset;
  }
  8.3333333333% {
    -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  16.6666666667% {
    -webkit-clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
  }
  25% {
    -webkit-clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
  }
  33.3333333333% {
    -webkit-clip-path: circle(50% at 50% 50%);
    clip-path: circle(50% at 50% 50%);
  }
  41.6666666667% {
    -webkit-clip-path: polygon(
      100% 0%,
      75% 50%,
      100% 100%,
      25% 100%,
      0% 50%,
      25% 0%
    );
    clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);
  }
  50% {
    -webkit-clip-path: polygon(
      75% 0%,
      100% 50%,
      75% 100%,
      0% 100%,
      25% 50%,
      0% 0%
    );
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  }
  58.3333333333% {
    -webkit-clip-path: polygon(
      75% 0%,
      100% 50%,
      75% 100%,
      0% 100%,
      25% 50%,
      0% 0%
    );
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  }
  66.6666666667% {
    -webkit-clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  75% {
    -webkit-clip-path: polygon(
      25% 0%,
      75% 0%,
      100% 50%,
      75% 100%,
      25% 100%,
      0% 50%
    );
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }
  83.3333333333% {
    -webkit-clip-path: polygon(
      50% 0%,
      83% 12%,
      100% 43%,
      94% 78%,
      68% 100%,
      32% 100%,
      6% 78%,
      0% 43%,
      17% 12%
    );
    clip-path: polygon(
      50% 0%,
      83% 12%,
      100% 43%,
      94% 78%,
      68% 100%,
      32% 100%,
      6% 78%,
      0% 43%,
      17% 12%
    );
  }
}

@keyframes cycle-shapes {
  0% {
    -webkit-clip-path: unset;
    clip-path: unset;
  }
  8.3333333333% {
    -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  16.6666666667% {
    -webkit-clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
  }
  25% {
    -webkit-clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
  }
  33.3333333333% {
    -webkit-clip-path: circle(50% at 50% 50%);
    clip-path: circle(50% at 50% 50%);
  }
  41.6666666667% {
    -webkit-clip-path: polygon(
      100% 0%,
      75% 50%,
      100% 100%,
      25% 100%,
      0% 50%,
      25% 0%
    );
    clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);
  }
  50% {
    -webkit-clip-path: polygon(
      75% 0%,
      100% 50%,
      75% 100%,
      0% 100%,
      25% 50%,
      0% 0%
    );
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  }
  58.3333333333% {
    -webkit-clip-path: polygon(
      75% 0%,
      100% 50%,
      75% 100%,
      0% 100%,
      25% 50%,
      0% 0%
    );
    clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  }
  66.6666666667% {
    -webkit-clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  75% {
    -webkit-clip-path: polygon(
      25% 0%,
      75% 0%,
      100% 50%,
      75% 100%,
      25% 100%,
      0% 50%
    );
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }
  83.3333333333% {
    -webkit-clip-path: polygon(
      50% 0%,
      83% 12%,
      100% 43%,
      94% 78%,
      68% 100%,
      32% 100%,
      6% 78%,
      0% 43%,
      17% 12%
    );
    clip-path: polygon(
      50% 0%,
      83% 12%,
      100% 43%,
      94% 78%,
      68% 100%,
      32% 100%,
      6% 78%,
      0% 43%,
      17% 12%
    );
  }
}
.glow {
  /* height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 1.5em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Caesar Dressing", cursive;
  font-size: max(3.333vmin, 16px);
}
.glow:before {
  --primary: #ff1e92;
  --secondary: #791eff;
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(20deg, var(--secondary) 40%, var(--primary));
  opacity: 0.2;
}

.btn {
  --primary: #ff1e92;
  --secondary: #791eff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  z-index: 1;
  font-size: 1em;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 0.5em;
  padding: 0.75em 1em;
  background: var(--primary);
  box-shadow: 0 0.1em 2em -0.75em var(--primary);
  transform: scale3d(1, 1, 1);
  font-family: inherit;
  text-align: center;
  color: white;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: 0.5s cubic-bezier(0.4, 0, 0, 1);
  transition-property: box-shadow, background, transform;
  will-change: box-shadow;
}
.btn:before {
  --size: 25%;
  --primary: #ff1e92;
  --secondary: #791eff;
  content: "";
  z-index: -1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: var(--size);
  aspect-ratio: 1;
  opacity: 0;
  background: var(--secondary);
  -webkit-animation: cycle-shapes 1s infinite steps(12);
  animation: cycle-shapes 1s infinite steps(12);
}
.btn:hover {
  --primary: #ff1e92;
  --secondary: #791eff;
  background: var(--secondary);
  box-shadow: 0 0.1em 2em -0.5em var(--secondary);
  transform: scale3d(1.075, 1.075, 1);
  transition-delay: 0.4s;
}
.btn:hover:before {
  --size: 20%;
  --primary: #ff1e92;
  --secondary: #791eff;
  opacity: 1;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  transition: 0.25s, opacity 0.4s, transform 0.75s 0.3s;
  transform: translate3d(-50%, -50%, 0) scale3d(5, 5, 5);
}
</style>
