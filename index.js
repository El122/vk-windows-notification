import notifier from "node-notifier";
import { VK, API, Upload, Updates } from "vk-io";
import path from "path";

import config from "./config.js";

const vk = new VK({ token: config.token });
const api = new API({ token: config.token });
const upload = new Upload({ api });
const updates = new Updates({
    api,
    upload,
});

updates.on("message", async (context) => {
    try {
        let sender = "";
        if (context.peerType == "user") {
            const senderInfo = (
                await vk.api.users.get({
                    user_ids: context.peerId,
                })
            )[0];
            sender = senderInfo.first_name + " " + senderInfo.last_name;
        } else
            sender = (
                await vk.api.messages.getConversationsById({
                    peer_ids: context.peerId,
                })
            ).items[0].chat_settings.title;

        notifier.notify({
            title: sender,
            message: context.text,
            icon: path.join("public/img/universe.png"),
        });
    } catch (e) {
        notifier.notify({
            title: "VK",
            message: "Новое сообщение VK",
        });
    }
});

updates.startPolling();
