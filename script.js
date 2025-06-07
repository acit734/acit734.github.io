// https://chatgpt.com/c/6835570b-85b4-8002-98bf-cd8e3c11b527
// https://yqnn.github.io/svg-path-editor/
document.addEventListener("DOMContentLoaded", () => {
const global_functions = {
    wait: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let loading_page = {
    elements: {
        main: document.querySelector(".main#loading-page"),
        ring_container: document.querySelector(".loading-page#ring-container"),
        loading_text: document.querySelector(".loading-page#loading-text"),
        dot_generate: document.querySelector(".loading-page#dot-generate"),
        ring_fallback1: document.querySelector(".loading-page.ring-fallback#ring-fallback1"),
        ring_fallback2: document.querySelector(".loading-page.ring-fallback#ring-fallback2"),
        ring_fallback: document.querySelectorAll(".loading-page.ring-fallback"),
    },

    variables: {
        path: "/assets/",
        blob_urls: {},
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
            ["image/loading-page/profile pic.jpeg", (obj) => {
                loading_page.elements.ring_container.style.backgroundImage = `url(${obj})`;
            }],
            ["image/loading-page/landscape background.jpg", (obj) => {
                loading_page.elements.main.style.backgroundImage = `url(${obj})`;
            }]
        ],
        loading_intervals: [],
    },

    functions_event_listener: {},

    functions_general: {
        load: () => {
            let requested_fetch =[];
            requested_fetch = loading_page.variables.resources_to_load.map((resource) => {
                return fetch(loading_page.variables.path + resource[0])
                .then(respond => respond.blob())
                .then(blob => {
                    file_url = URL.createObjectURL(blob);
                    loading_page.variables.blob_urls[resource[0]] = file_url;
                    resource[1](file_url);
                })
            })

            Promise.all(requested_fetch).then(() => {
                console.log("Data loaded.")
                loading_page.functions_general.loading_finished();
            })
        },
        dot_generate: () => {
            let dot_generate = loading_page.elements.dot_generate;
            if (dot_generate.textContent === "...") {
                dot_generate.textContent = '';
            } else {
                dot_generate.textContent += '.'
            }
        },
        ring_fallback: async () => {
            const wait = global_functions.wait;
            const ring_fallback1 = loading_page.elements.ring_fallback1
            const ring_fallback2 = loading_page.elements.ring_fallback2
            const ring_fallback = loading_page.elements.ring_fallback

            ring_fallback1.style.transform = "translate(-50%, -50%) scale(0.8)";
            ring_fallback1.style.opacity = "0";

            await wait (300);

            ring_fallback2.style.transform = "translate(-50%, -50%) scale(0.8)";
            ring_fallback2.style.opacity = "0";
            
            await wait(500);

            [...ring_fallback].map((element) => {
                element.classList.add("no-transition");
                element.style.opacity = '';
                element.style.transform = '';
            });
            await wait(100);
            [...ring_fallback].map((element) => {
                element.classList.remove("no-transition");
            });
        },
        loading_finished: async () => {
            const wait = global_functions.wait;
            let loading_intervals = loading_page.variables.loading_intervals;
            let ring_container = loading_page.elements.ring_container;
            let loading_text = loading_page.elements.loading_text;
            let main = loading_page.elements.main;

            loading_intervals.map(interval => {
                clearInterval(interval);
            });

            loading_text.textContent = "Done!";
            loading_text.style.opacity = "0";

            ring_container.style.transform = "rotateY(360deg) scale(0.4)";

            await wait(750);

            ring_container.classList.add("transition");
            main.classList.add("transition");
        }
    },

    _init: () => {
        let loading_intervals = loading_page.variables.loading_intervals;
        loading_page.functions_general.load();

        loading_intervals.push(setInterval(loading_page.functions_general.dot_generate, 1000));
        loading_intervals.push(setInterval(loading_page.functions_general.ring_fallback, 4000));
    }
}
loading_page._init()
// console.log(new TextEncoder().encode(JSON.stringify(loading_page)).length)
});