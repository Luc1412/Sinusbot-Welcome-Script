registerPlugin({
    name: 'Verify Script',
    version: '1.0',
    description: 'Assignment Script for !|Wutknolle12 | Paul ᵔᴥᵔ#4079',
    author: 'Luc1412 <Luc1412.de>',
    vars: [
        {
            name: 'welcome_message',
            title: 'Set the Message which is displayed on Server join. [Markdown supported!]\n%username% will be replaced with the User name\n%online_user% will be replaced with the online User',
            type: 'multiline',
            placeholder: 'Welcome on the Server %username%.\nThere are currently %online_user% User online!'
        },
        {
            name: 'verify_command',
            title: 'The command which the User use to verify.',
            type: 'string',
            placeholder: '!verify'
        },
        {
            name: 'verify_group_id',
            title: 'The id of the verified group.',
            type: 'string',
            placeholder: 'Insert Group ID!'
        },
        {
            name: 'verify_message',
            title: 'Set the Message if a User was successfully verified! [Markdown supported!]',
            type: 'string',
            placeholder: 'You got successfully verified!'
        },
        {
            name: 'verified_message',
            title: 'Set the Message if a User is already verified! [Markdown supported!]',
            type: 'string',
            placeholder: 'You\'re already verified!'
        },
        {
            name: 'joined_clients',
            title: 'All Clients which already joined',
            type: 'strings',
        }]
}, function (sinusbot, config) {

    var event = require('event');
    var backend = require('backend');
    var engine = require('engine');

    if (typeof config.welcome_message === 'undefined') config.welcome_message = 'Welcome on the Server %username%.\nThere are currently %online_user% User online!';
    if (typeof config.verify_command === 'undefined') config.verify_command = "!verify";
    if (typeof config.verify_message === 'undefined') config.verify_message = "You got successfully verified!";
    if (typeof config.verified_message === 'undefined') config.verified_message = "You're already verified!";
    if (typeof config.joined_clients === 'undefined') {
        config.joined_clients = [];
        engine.saveConfig(config)
    }


    event.on('clientMove', function (ev) {
        if (ev.fromChannel === undefined && config.joined_clients.indexOf(ev.client.uid()) < 0 && !ev.client.isSelf()) {
            var message = config.welcome_message;
            message = message.replace('%username%', ev.client.name());
            message = message.replace('%online_user%', onlineUser());
            ev.client.chat(message);
            config.joined_clients.push(ev.client.uid());
            engine.saveConfig(config)
        }
    });

    event.on('chat', function (ev) {
        if (ev.text.toLowerCase() === config.verify_command.toLowerCase()) {
            if (typeof config.verify_group_id === "undefined") {
                engine.log('No Server Group ID set!');
                return
            }
            var group = backend.getServerGroupByID(config.verify_group_id);
            if (!isInGroup(ev.client, group)) {
                ev.client.addToServerGroup(group);
                ev.client.chat(config.verify_message);
            } else {
                ev.client.chat(config.verified_message)
            }
        }
    });

    function isInGroup(client, groupCheck) {
        var inGroup = false;
        client.getServerGroups().forEach(function (group) {
            if (groupCheck.id() === group.id()) {
                inGroup = true;
            }
        });
        return inGroup
    }

    function onlineUser() {
        return backend.getClients().length.toString()
    }
});