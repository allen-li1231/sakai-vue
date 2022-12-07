<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img src="images/logo2.png" alt="Lakala logo" class="mb-5" style="width:180px; height:42px;">
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">风控模型平台</div>
                        <span class="text-600 font-medium">用户登录</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">用户名</label>
                        <InputText id="email1" v-model="email" type="text" placeholder="Email or Username" style="padding:1rem;" @blur="validateEmail" v-bind:class="['w-full', 'mb-3', msg['email']? 'p-invalid': '']"/>
						<InlineMessage style="margin-bottom:1rem;" v-if="msg.email">{{msg.email}}</InlineMessage>

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">密码</label>
                        <Password id="password1" v-model="password" placeholder="Password"
                            :toggleMask="true" :feedback="false" @blur="validatePassword" v-bind:class="['w-full', 'mb-3', msg['password']? 'p-invalid': '']"
                            inputClass="w-full" inputStyle="padding:1rem">
                        </Password>
                         <InlineMessage style="margin-bottom:1rem;" v-if="msg.password">{{msg.password}}</InlineMessage>
                        <div class="flex align-items-center justify-content-between mb-5">
                            <!-- <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1">记住我</label>
                            </div> -->
                            <!-- <a class="font-medium no-underline ml-2 text-left cursor-pointer" style="color: var(--primary-color)">忘记密码?</a> -->
                        </div>
                        <Button label="登 录" class="w-full p-3 text-xl" @click="doLogin()"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import router from '@/router'

export default {
    data() {
        return {
            email: '',
            password: '',
            checked: false,
            is_username: false,
            msg: []
        }
    },
    methods: {
        validateEmail() {
            const group = this.email.match(/^[a-zA-Z0-9]+$|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$)/)
            if (group) {
                this.msg["email"] = '';
                this.is_username = group[1]? false: true;
                return true;
            } else {
                this.msg["email"] = '请输入格式正确的用户名或邮箱';
                return false;
            }
        },
        validatePassword(){
            if (this.password.length == 0) {
                this.msg["password"] = '请输入密码';
                return false;
            }
            else {
                this.msg["password"] = '';
                return true;
            }
        },
        doLogin() {
            const self = this;
            if (this.validateEmail() && this.validatePassword()) {
                // send form data to the server
                this.$api.post('/login/', {
                    [this.is_username? "username": "email"]: this.email,
                    password: this.password
                })
                .then(function (response) {
                    // register global user info
                    self.$userProfile.value = response.data;
                    router.push({ name: 'dashboard' });
                })
                .catch(function (error) {
                    if (error.response) {
                        const data = error.response.data;
                        [self.msg["password"]] = data['password'] ?? '';
                        [self.msg["password"]] = data['non_field_errors'] ?? '';
                        self.msg["email"] = data['email'] ?? '';
                        [self.msg["email"]] = !self.msg["email"]? data['username'] ?? '': self.msg["email"];
                    }
                    else{
                        self.msg["password"] = error.request.message;
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>