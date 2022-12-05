export function getUserProfile(username) {
    this.$api.get(`/profile/${username}`)
    .then(function (response) {
        // register global user info
        self.$userProfile.value = response.data;
        router.push({ name: 'dashboard' });
    })
    .catch(function (error) {
        const data = error.response.data;
        [self.msg["password"]] = data['password'] ?? '';
        [self.msg["password"]] = data['non_field_errors'] ?? '';
        self.msg["email"] = data['email'] ?? '';
        [self.msg["email"]] = !self.msg["email"]? data['username'] ?? '': self.msg["email"];
    });
}

export function setUserProfile(formData) {
    this.$api.post(`/profile/${username}`, formData)
    .then(function () {
        // register global user info
        self.$userProfile.value = formData;
    })
    .catch(function (error) {
        alert(error);
    });
}