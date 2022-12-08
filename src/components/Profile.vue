<template>
	<Toast /> 
	<div class="grid">
		<div class="col-12">
			<div class="card p-fluid">
				<h5>基本信息</h5>
				<div class="grid formgrid">
					<div class="field col">
						<label for="username">用户名</label>
						<span class="p-input-icon-left">
							<i class="pi pi-user" />
							<InputText id="username" type="text" placeholder="Username" v-model="userProfile['username']" :modelValue="userProfile['username']" :class="usernameClass" />
						</span>
					</div>
					<div class="field col">
						<label for="email" >邮箱</label>
						<InputText id="email" type="text" v-model="userProfile['email']" :modelValue="userProfile['email']" :class="emailClass"/>
					</div>
					<InlineMessage style="margin-top:1.6rem;margin-bottom:1rem;" v-if="basicErrorMsg">{{basicErrorMsg}}</InlineMessage>
				</div>
				<div class="grid formgrid">
					<div class="field">
						<ConfirmPopup></ConfirmPopup>
						<Button label="提交" @click="confirmSubmitBasic" icon="pi pi-check" class="p-button" ></Button>
					</div>
					<div class="field">
						<Button label="修改密码" @click="openPasswordChangeDialog" class="p-button-link mr-2 mb-2" />
					</div>
				</div>
				<Dialog header="修改密码" v-model:visible="showPasswordChange" :modal="true" style="min-width:20rem;">
				<div class="field p-fluid">
					<label for="password" >旧密码</label>
					<Password id="password" :feedback="false" v-model="oldPassword" :class="passwordClass"/>
					<InlineMessage style="margin-top:1.6rem;margin-bottom:1rem;" v-if="passwordErrorMsg">{{passwordErrorMsg}}</InlineMessage>
				</div>
				<div class="field p-fluid">
					<label for="password" >新密码</label>
					<Password id="password" v-model="password" :class="passwordClass"/>
				</div>
				<div class="field p-fluid">
					<label for="confirmPassword" >确认密码</label>
					<Password id="confirmPassword" :feedback="false" v-model="confirmPassword" :class="passwordClass"/>
				</div>
				<template #footer>
					<ConfirmPopup></ConfirmPopup>
					<Button label="提交" @click="confirmSubmitPassword" icon="pi pi-check" class="p-button" ></Button>
				</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import userAPI from '@/service/user';

export default {
	data() {
		return {
			userProfile: {'username': null, 'email': null},
			usernameClass: '',
			emailClass: '',
			showPasswordChange: false,
			oldPassword: null,
			password: null,
			confirmPassword: null,
			passwordErrorMsg: '',
			passwordClass: '',
			basicErrorMsg: ''
		}
	},
	async created() {
		// always keep user profile data
		if (this.$userProfile.value) {
			this.userProfile = this.$userProfile.value;
		}
		else {
			const buffer = await userAPI.getUserProfile();
			this.$userProfile.value = buffer;
			this.userProfile['username'] = buffer['username'];
			this.userProfile['email'] = buffer['email'];
		}
	},
	methods: {
		openPasswordChangeDialog() {
			this.showPasswordChange = true;
		},
		closePasswordChangeDialog() {
			this.showPasswordChange = false;
		},
		validateBasic() {
			var ret = true;
			if (this.userProfile['username'] && this.userProfile['username'].match(/^[a-zA-Z0-9]+$/)) {
				this.usernameClass = '';
				this.basicErrorMsg = '';
			}
			else {
				this.usernameClass = 'p-invalid';
				this.basicErrorMsg = '用户名应包含英文或数字';
				ret = false;
			}
			if (this.userProfile['email'] && this.userProfile['email'].match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/)) {
				this.emailClass = '';
				this.basicErrorMsg = this.basicErrorMsg ? this.basicErrorMsg : '';
			}
			else {
				this.emailClass = 'p-invalid';
				this.basicErrorMsg = '请输入格式正确的邮箱';
				ret = false;
			}
			return ret;
		},
		validatePassword() {
			if (!this.oldPassword) {
				this.$toast.add({severity:'error', summary: '修改失败', detail:'请输入旧密码', life: 3000});
				return false;
			}
			if (!this.password || !this.confirmPassword) {
				this.$toast.add({severity:'error', summary: '修改失败', detail:'请输入新密码两次', life: 3000});
				return false;
			}
			else if (this.password !== this.confirmPassword) {
				this.$toast.add({severity:'error', summary: '修改失败', detail:'密码输入不一致', life: 3000});
				return false;
			}
			return true;
		},
		confirmSubmitBasic($event) {
			$event.preventDefault();
			if (this.validateBasic()) {
				this.$confirm.require({
					target: $event.currentTarget,
					message: '是否确认操作？',
					icon: 'pi pi-exclamation-triangle',
					accept: async () => {
						console.log(this.userProfile);
						await userAPI.changeUserProfile(this.userProfile);
						this.$toast.add({severity:'success', summary: '基本信息修改', detail:'修改成功', life: 3000});
					},
					reject: () => {}
				});
			}
		},
		confirmSubmitPassword($event) {
			$event.preventDefault();
			if (this.validatePassword()) {
				this.$confirm.require({
					target: $event.currentTarget,
					message: '将进行登出操作，是否继续？',
					icon: 'pi pi-exclamation-triangle',
					accept: () => {
						userAPI.changePassword({
							'old_password': this.oldPassword,
							'password': this.password
						}).then (() => {
							this.passwordErrorMsg = '';
							this.$toast.add({severity:'success', summary: '修改成功', detail:'即将进行登出', life: 3000});
							this.closePasswordChangeDialog()
							setTimeout(() => {
								this.$router.push({ "name": "login" });
							}, 1000);
						}).catch ((error) => {
							[this.passwordErrorMsg] = error.response.data;
						})
					},
					reject: () => {}
				});
			}
		}
	}
}
</script>