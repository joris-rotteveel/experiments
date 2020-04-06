<template>
  <!-- <div class="top" ref="top">
      <img :src="activeHero.src" />
    </div> -->
  <div class="project">
    <main ref="container" class="content">
      <router-link to="/">Go home</router-link>
      <h2>{{ project.id }}</h2>
      <section>
        <IntrinsicImage
          v-for="(image, index) in project.images"
          ref="images"
          :key="index"
          :settings="image"
        ></IntrinsicImage>
      </section>
    </main>

    <div ref="link" class="next">
      <router-link class="next__link" :to="`/project/${nextProject.id}`">
        Next
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import IntrinsicImage from "../components/IntrinsicImage.vue";
import { mapRange } from "../utils/math";
import { actions as animationActions } from "../observables/ProjectsObservable";

gsap.registerPlugin(ScrollToPlugin);

export default {
  components: {
    IntrinsicImage
  },

  data() {
    return {
      projectId: this.$route.params.id,
      activeColor: null,
      activeHero: null,
      isPastCenter: false
    };
  },

  computed: {
    ...mapGetters({ getProjectByID: "projects/getProjectByID" }),
    project() {
      return this.$store.getters["projects/getProjectByID"](this.projectId);
    },
    nextProject() {
      return this.$store.getters["projects/getNextProject"](
        parseInt(this.projectId)
      );
    },
    animationActions() {
      return animationActions;
    }
  },
  watch: {
    isPastCenter: {
      immediate: true,
      handler: function(val) {
        this.animationActions.setHighlight(
          val ? this.nextProject.id : this.project.id
        );

        const small = { duration: 0, scale: 0.5 };
        const big = { duration: 0, scale: 1 };
        this.animationActions.setAnimation(val ? small : big);
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.animationActions.setHighlight(this.project.id);
    this.parallaxItems = this.$refs.images.map(function(component) {
      const rect = component.$el.getBoundingClientRect();
      const start = Number(component.$el.getAttribute("parallax-start"));
      const end = Number(component.$el.getAttribute("parallax-end"));
      return {
        el: component.$el,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        start,
        end
      };
    });
    this.update();
  },

  beforeRouteUpdate(to, from, next) {
    const { container, link } = this.$refs;
    const duration = 0.25;
    const tl = gsap.timeline();

    // let interested components know we are animating
    this.animationActions.setAnimation({ scale: 1, duration });

    gsap.to(window, { duration, scrollTo: document.body.scrollHeight });

    tl.to(link, {
      duration,
      y: 100,
      alpha: 0
    }).to(container, {
      duration,
      y: window.innerHeight * -0.5,
      onComplete: () => {
        next();
      }
    });
  },
  methods: {
    update() {
      this.isPastCenter = window.scrollY > window.innerHeight * 1.25;

      if (this.parallaxItems.length) {
        const currentScrollPos = window.scrollY;
        for (let i = 0; i < this.parallaxItems.length; i++) {
          const item = this.parallaxItems[i];
          const { bottom, start, top, end, el } = item;
          const visiblePosMin = top - window.innerHeight;
          const visiblePosMax = bottom;
          if (
            currentScrollPos > visiblePosMin &&
            currentScrollPos < visiblePosMax
          ) {
            const l = mapRange(
              currentScrollPos,
              visiblePosMin,
              visiblePosMax,
              start,
              end
            );
            el.style.transform = "translate3d(0,".concat(l, "%,0)");
          }
        }
      }
      requestAnimationFrame(this.update);
    }
  }
};
</script>

<style scoped>
.project {
  position: relative;
  z-index: 2;
  padding-top: 100vh;
}
.content {
  width: 100%;
  background: white;
}

.next {
  width: 100vw;
  height: 50vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 5rem;
}

.next__link {
  transform: translateY(-50%);
  color: black;
}
.image {
  width: 25vw;
}

.top {
  position: fixed;
  top: 0;
  display: flex;
  align-content: flex-end;
  text-align: center;
  background-color: grey;
  width: 100%;
  height: 100vh;
  z-index: 1;
  flex-direction: column;
  justify-content: flex-end;
}

.top .image {
  width: 100vw;
}
</style>
