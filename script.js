// https://chatgpt.com/c/6835570b-85b4-8002-98bf-cd8e3c11b527
(() => {
let loading = {
    elements: {},

    variables: {
        path: "/assets/",
        resources_to_load: [
            ["font/Arial.ttf", (obj) => {
                const style = document.createElement("style");
                style.textContent = `
                    @font-face {
                        font-family: arial-upload;
                        src: url(${obj}) format(truetype);
                        font-weight: normal;
                    }
                    
                    body {
                        font-family: arial-upload;
                    }
                `;
                document.head.append(style);
            }],
        ],
        blob_urls: {},
    },

    functions_event_listener: {},

    functions_general: {
        load: () => {
            let requested_fetch =[];
            requested_fetch = loading.variables.resources_to_load.map((resource) => {
                return fetch(loading.variables.path + resource[0])
                .then(respond => respond.blob())
                .then(blob => {
                    file_url = URL.createObjectURL(blob);
                    loading.variables.blob_urls[resource[0]] = file_url;
                    resource[1](file_url);
                })
            })
        }
    },

    _init: () => {
        loading.functions_general.load();
    }
}
loading._init()
})()