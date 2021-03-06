<template>
  <div class="project">
    <main ref="container" class="content">
      <router-link to="/">Go home</router-link>
      <h2>{{ project.id }}</h2>
      <section>
        <div
          v-for="(image, index) in project.images"
          :key="index"
          class="image"
        >
          <IntrinsicImage ref="images" :settings="image"></IntrinsicImage>
        </div>
      </section>
    </main>

    <div ref="link" class="next">
      <router-link
        v-if="getNextProject(project.id)"
        class="next__link"
        :to="`/project/${getNextProject(project.id).id}`"
      >
        Next project
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import gsap from 'gsap';
import IntrinsicImage from '@/components/IntrinsicImage.vue';
import { actions as animationActions } from '@/observables/ProjectsObservable';
import { mapRange } from '@/utils/math';

export default {
  layout: 'project',
  components: {
    IntrinsicImage
  },
  async fetch({ store, error, params }) {
    try {
      await store.dispatch('projects/fetchProjects');
      await store.dispatch('projects/fetchProject', params.id);
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch project #' + params.id
      });
    }
  },

  data() {
    return {
      isPastCenter: false,
      parallaxItems: []
    };
  },

  computed: {
    ...mapState({
      project: (state) => state.projects.project
    }),
    getNextProject() {
      return this.$store.getters['projects/getNextProject'];
    },
    animationActions() {
      return animationActions;
    }
  },
  watch: {
    isPastCenter: {
      immediate: true,
      handler(val) {
        this.animationActions.setHighlight(
          val ? this.getNextProject(this.project.id).id : this.project.id
        );

        const small = { duration: 0, scale: 0.5 };
        const big = { duration: 0, scale: 1 };

        this.animationActions.setAnimation(val ? small : big);
      }
    }
  },
  mounted() {
    // this.animationActions.setHighlight(this.project.id);
    this.parallaxItems = this.$refs.images.map(function(component) {
      const rect = component.$el.getBoundingClientRect();
      const start = Number(component.$el.getAttribute('parallax-start'));
      const end = Number(component.$el.getAttribute('parallax-end'));
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
    this.animationActions.setAnimation({ scale: 1, duration, delay: duration });

    // gsap.to(window, { duration, scrollTo: document.body.scrollHeight });

    tl.to(link, {
      duration,
      y: 100,
      alpha: 0
    }).to(container, {
      duration,
      y: window.innerHeight * -0.5,
      onComplete: () => {
        window.scrollTo(0, 0);
        gsap.to(container, { duration: 0, y: 0 });
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
            el.style.transform = 'translate3d(0,'.concat(l, '%,0)');
          }
        }
      }
      // console.log(this.isPastCenter);
      requestAnimationFrame(this.update);
    }
  },
  head() {
    return {
      title: 'Project #' + this.project.id,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'What you need to know about Project #' + this.project.id
        }
      ]
    };
  }
};
</script>

<style scoped>
.image {
  width: 35vw;
}
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
</style>
