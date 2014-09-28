define([], function () {
    'use strict';

    return [
        {
            pk: 1,
            name: 'All',
            status: 2,
            parent: null
        },
        {
            pk: 2,
            name: 'Thor',
            status: 2,
            parent: 1
        },
        {
            pk: 3,
            name: 'Apache',
            status: 1,
            parent: 2
        },
        {
            pk: 4,
            name: 'Teamspeak',
            status: 1,
            parent: 2
        },
        {
            pk: 5,
            name: 'Mumble',
            status: 1,
            parent: 2
        },
        {
            pk: 6,
            name: 'Shares',
            status: 2,
            parent: 2
        },
        {
            pk: 7,
            name: 'Samba',
            status: 1,
            parent: 6
        },
        {
            pk: 8,
            name: 'NFS',
            status: 1,
            parent: 6
        },
        {
            pk: 9,
            name: 'AFP',
            status: 1,
            parent: 6
        },
        {
            pk: 10,
            name: 'Public',
            status: 1,
            parent: 6
        },
        {
            pk: 11,
            name: 'Media',
            status: 3,
            parent: 6
        },
        {
            pk: 12,
            name: 'Ymir',
            status: 10,
            parent: 1
        }
    ];

});