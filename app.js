// Register a global custom directive called v-focus
Vue.directive('ripple', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    console.log('el', el);

    el.addEventListener('mousedown', function(ev) {
      console.log('ev', ev);
      console.log('hi');
      /*var offset = {x: el.offsetLeft, y: el.offsetTop};
      var pos = {x: ev.pageX, y: ev.pageY};
      */
      var rect = el.getBoundingClientRect();
      var offset = {x: rect.left, y: rect.top};
      var pos = {x: ev.clientX, y: ev.clientY};

      var elRip = document.createElement('div');
      elRip.className = 'ripple';

      elRip.style.top = (pos.y - offset.y) + 'px';
      elRip.style.left = (pos.x - offset.x) + 'px';
      el.appendChild(elRip);

      setTimeout(function() {
        el.removeChild(elRip);
      }, 1000);
      return true;
    });
    el.addEventListener('click', function(ev) {
      console.log('click');
    });
  }
})

// 0. If using a module system, call Vue.use(VueRouter)

// 1. Define route components.
// These can be imported from other files
const Foo = {
  template: `<div>
      This is the first page
      <h1>Overview</h1>
      name: {{ name }}<br />
      salary: {{ salary }}
      <router-link to="/foo/edit" class="btn tab-link" v-ripple>edit</router-link>
    </div>`,
  data: function() {
    return {
      name: 'my name is',
      salary: '1000€'
    };
  }
}

const EditFoo = {
  template: `<div>
      Lets edit this page
    </div>`,
  data: function() {
    return {
      name: 'my name is',
      salary: '1000€'
    };
  }
}
const Bar = { template: `
  <div>
    this is a list view
    <div class="card" v-for="item in list" v-ripple v-on:click="openDetail(item)">

      <div class="row">

        <div class="col col-2">
          <img src="http://loremflickr.com/50/50" class="card-avatar" />
        </div>
        <div class="col col-10">
          This is the name {{ item }} <br />second line
        </div>
      </div>
      <div>Some more text over there</div>
    </div>
  </div>`,
data: function() {
  return {
    list: [1,2,3,4,5]
  }
},
methods: {
  openDetail: function(id) {
    console.log(id);
    router.push({path: 'bar/detail/'+id});
  }
}
};
const P3 = {
  template: '#fake-list',
  data: function() {
    return {list: fake_data}
  },
   methods: {
    goTo: function(id) {
      router.push({path: 'p3/'+id});
    }
  }
};

const P3Detail = {
  template: '#fake-detail',
  data: function() {
    return {item: fake_data[0]}
  },
  mounted: function() {

  },
  created: function() {
    console.log();
    var id = this.$route.params;
    for (var i = 0; i < fake_data.length; i++) {
      if (fake_data[i]._id == id) {
        this.idx = i;
        console.log('idx', i);
      }
    }
  }
}


const P4 = {
template: '#chat',
  data: function() {
    return  {
      inp: 'Hello Vue!',
      msg: []
    }
  },
  methods: {
    send: function() {
      var send = this.inp.trim();
      if (send != "") {
        firebase.database().ref('/chat').push({msg: send, time: new Date().getTime()});
        console.log('Send', send);
        this.inp = '';
        console.log('this msg', this.msg);
      }
    },
    transformTime: function(time) {
      var diff = Math.floor((new Date().getTime() - time) / 1000);
      if (diff < 60) {
        return 'vor ' + diff + 's';
      } else if (diff < 60 * 60) {
        return 'vor '+ Math.floor(diff / 60) + 'min';
      } else {
        return 'diff ' + diff;
      }
    }
  },
  created: function() {
    var self = this;
    var msgRef = firebase.database().ref('/chat');
    msgRef.once('value').then(function(snapshot) {
      self.msg = snapshot.val();
    });

    msgRef.on('child_added', function(data) {
      console.log(data.val());
      //self.msg[data.key] = data.val();
      Vue.set(self.msg, data.key, data.val())
    });
  }
};





const BarDetail = {
  template: `<div>DEtail{{ $route.params.id }}</div>`,
}
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  //mode: 'history',
  base: '/vuejs',
  routes: [
    { path: '/', component: Foo},
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '/p3', component: P3 },
    { path: '/p3/:id', component: P3Detail },
    { path: '/p4', component: P4 },
    { path: '/foo/edit', component: EditFoo},
    { path: '/bar/detail/:id', component: BarDetail}
  ]
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router
}).$mount('#app')

/*
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});*/




function ajax(url, success, error) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      success();
      var data = JSON.parse(request.responseText);
    } else {
      // We reached our target server, but it returned an error
      error();
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    error();
  };

  request.send();
}


/*
real data

var data = "country_version=deu&language=DE&actor=native_salary_calculator_phone_gap_v1&query[industry_id]=1&query[function_id]=1&query[career_level_id]=1&query[given_salary]=1&query[lng]=11.578&query[lat]=48.137&query[job_salary_range_id]=1"

ajax("https://api.experteer.com/data/v1/salary_comparison/get_data?" + data, function(res) {
  console.log(res);
})
*/