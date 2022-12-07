"use strict";
import $api from '@/service/base';

const userAPI = {

    doLogout() {
        return $api.get(`/logout/`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            alert(error);
        });
    },

    getUserProfile() {
        return $api.get(`/api/profile/`)
        .then(function (response) {
            // register global user info
            return response.data;
        })
    },

    changeUserProfile(formData) {
        return $api.put(`/api/profile/`, formData)
        .then(function (response) {
            // register global user info
            return response.data;
        })
    },

    changePassword(formData) {
        return $api.put(`/api/password/`, formData)
        .then(function (response) {
            // register global user info
            return response.data;
        })
    }
};

export default userAPI;