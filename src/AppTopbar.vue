<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" src="images/logo2.png" />
			<span>风控模型平台</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-calendar"></i>
					<span>提醒</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button" @click="onSettingsClick">
					<i class="pi pi-cog"></i>
					<span>平台设置</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button"  @click="onProfileClick">
					<i class="pi pi-user"></i>
					<span>个人设置</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button"  @click="doLogout">
					<i class="pi pi-sign-out"></i>
					<span>退出登录</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
import userAPI from '@/service/user';

export default {
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onSettingsClick(event) {
            this.$emit('settings-toggle', event);
        },
		onProfileClick() {
            this.$router.push({ name: 'profile'});
        },
		async doLogout() {
			await userAPI.doLogout();
			this.$router.push({ "name": "login" })
		}
    },
}
</script>