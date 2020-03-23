<template>
  <div>
    <div class="top" ref="top">
      <img :src="activeHero.src" />
    </div>
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

      <div class="next">
        <router-link :to="`/project/${nextProject.id}`">
          Next
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import IntrinsicImage from "../components/IntrinsicImage.vue";
import { mapRange } from "../utils/math";
import gsap from "gsap";

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
    }
  },
  watch: {
    activeColor: function() {
      const { top } = this.$refs;

      gsap.set(top, {
        backgroundColor: this.activeColor
      });
    },
    isPastCenter: {
      immediate: true,
      handler: function(val) {
        console.log(val);
        if (val) {
          this.activeHero = this.nextProject.hero;
        } else {
          this.activeHero = this.project.hero;
        }
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.$store.dispatch("projects/setProject", this.project.id);
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
    const { container, top } = this.$refs;
    const duration = 0.25;
    const tl = gsap.timeline();
    tl.to(container, {
      duration,
      y: window.innerHeight * -0.5
    }).to(top, {
      backgroundColor: this.nextProject.color,
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
