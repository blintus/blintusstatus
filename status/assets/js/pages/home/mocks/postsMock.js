define([], function () {
    'use strict';

    return {

        posts: [
            {
                pk: 1,
                created: '2014-09-21',
                updated: '',
                message: 'This is about Teamspeak being ok.',
                user: {
                    username: 'dave'
                },
                status: 1,
                category: 4,
                title: 'Teamspeak ok'
            },
            {
                pk: 2,
                created: '2014-09-20',
                updated: '',
                message: 'This is about the media share being broken.',
                user: {
                    username: 'dave'
                },
                status: 3,
                category: 11,
                title: 'Media down'
            },
            {
                pk: 3,
                created: '2014-09-19',
                updated: '',
                message: 'This is about the shares only kind of working.',
                user: {
                    username: 'dave'
                },
                status: 2,
                category: 6,
                title: 'Shares sort of ok'
            }
        ]

    };

});