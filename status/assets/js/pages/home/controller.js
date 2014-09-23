define(['pageUtils', 'pages/home/view'], function (pageUtils, HomeView) {
    'use strict';

    var HomeController = function () {
        this.view = null;
    };

    HomeController.prototype.start = function ($container) {
        pageUtils.setTitle("Home");
        this.view = new HomeView($container);
        this.loadAllData();
    };

    HomeController.prototype.loadAllData = function () {
        var that = this;

        $.when({
            posts: [
                {
                    created: '2014-09-21',
                    updated: '',
                    message: 'This is about Teamspeak being ok.',
                    user: {
                        username: 'dave'
                    },
                    status: 1,
                    category: {
                        id: 1,
                        name: 'Teamspeak',
                        parent: null
                    },
                    title: 'Teamspeak ok',
                    comments: []
                },
                {
                    created: '2014-09-20',
                    updated: '',
                    message: 'This is about the media share being broken.',
                    user: {
                        username: 'dave'
                    },
                    status: 3,
                    category: {
                        id: 1,
                        name: 'Media',
                        parent: null
                    },
                    title: 'Media down',
                    comments: []
                },
                {
                    created: '2014-09-19',
                    updated: '',
                    message: 'This is about the shares only kind of working.',
                    user: {
                        username: 'dave'
                    },
                    status: 2,
                    category: {
                        id: 2,
                        name: 'Shares',
                        parent: null
                    },
                    title: 'Shares sort of ok',
                    comments: []
                }
            ]
        },{
            categories: [
                {
                    name: 'All',
                    status: 2,
                    children: [
                        {
                            name: 'Thor',
                            status: 2,
                            children: [
                                {
                                    name: 'Apache',
                                    status: 1,
                                    children: []
                                },
                                {
                                    name: 'Teamspeak',
                                    status: 1,
                                    children: []
                                },
                                {
                                    name: 'Mumble',
                                    status: 1,
                                    children: []
                                },
                                {
                                    name: 'Shares',
                                    status: 2,
                                    children: [
                                        {
                                            name: 'Samba',
                                            status: 1,
                                            children: []
                                        },
                                        {
                                            name: 'NFS',
                                            status: 1,
                                            children: []
                                        },
                                        {
                                            name: 'AFP',
                                            status: 1,
                                            children: []
                                        },
                                        {
                                            name: 'Public',
                                            status: 1,
                                            children: []
                                        },
                                        {
                                            name: 'Media',
                                            status: 3,
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Ymir',
                            status: 10,
                            children: []
                        }
                    ]
                }
            ]
        }).done(function (postResponse, categoryResponse) {
            that.view.setPosts(postResponse.posts);
            //that.view.setCategories(categoryResponse.categories);
            console.log(categoryResponse.categories);
        });
    };

    return HomeController;

});