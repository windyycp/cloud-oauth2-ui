<template>
    <div></div>
</template>

<script setup>

import Axios from 'axios'
import { onMounted } from 'vue'

onMounted(() => {
    var clientId = import.meta.env.VITE_AUTH_CLIENT;
    var host = window.location.host;
    if (host === 'demo.bortron.com') {
        host = host + window.location.pathname;
    }
    var clientCallbackUrl = window.location.protocol + "//" + host + "/#/callback"
    var callbackUrl = encodeURIComponent(clientCallbackUrl);
    var authHost =  import.meta.env.VITE_AUTH_LOGIN;
    var env = import.meta.env.VITE_ENV;
    if (env === 'product') {
        window.location.href = authHost + '/#/login?clientId=' + clientId;
    } else {
        window.location.href = authHost + '/#/login?clientId=' + clientId + "&clientCallbackUrl=" + callbackUrl;
    }
})


</script>
