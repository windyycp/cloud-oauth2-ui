<template>
    <div></div>
</template>

<script setup>

import Axios from 'axios'
import { onMounted } from 'vue'
import {Session} from '/@/utils/storage';

onMounted(() => {
    var clientId = import.meta.env.VITE_AUTH_CLIENT;
    var host = window.location.host;
    var clientCallbackUrl = window.location.protocol + "//" + host + "/callback"
    var callbackUrl = encodeURIComponent(clientCallbackUrl);
    var apiHost = import.meta.env.VITE_API_URL;
    var env = import.meta.env.VITE_ENV;

    // csrf 防护
    var sessionState = new Date().getTime();
    Session.set("state", sessionState);

    window.location.href = apiHost 
            + '/oauth2/login?state=' + sessionState
            + '&redirect_uri=' + callbackUrl
            + '&client_id=' + clientId;
})


</script>
