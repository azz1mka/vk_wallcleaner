const token = "здесь access_token";
const owner_id = "здесь user_id";

async function clearWall() {

    while (true) {

        let wall = await fetch(`https://api.vk.com/method/wall.get?owner_id=${owner_id}&count=25&access_token=${token}&v=5.269`);
        let data = await wall.json();

        if (!data.response || data.response.items.length === 0) {
            console.log("Стена полностью очищена");
            break;
        }

        let ids = data.response.items.map(p => p.id);

        let code = `
            var ids = [${ids.join(",")}];
            var i = 0;
            while (i < ids.length) {
                API.wall.delete({"owner_id": ${owner_id}, "post_id": ids[i]});
                i = i + 1;
            }
            return ids.length;
        `;

        await fetch("https://api.vk.com/method/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `access_token=${token}&v=5.269&code=${encodeURIComponent(code)}`
        });

        console.log("Удалено:", ids.length);

        await new Promise(r => setTimeout(r, 350));
    }
}

clearWall();
