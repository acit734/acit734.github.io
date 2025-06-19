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
        vignette: document.querySelector(".loading-page#vignette"),
        hello_text: document.querySelector(".loading-page#hello-text"),
        loading_text: document.querySelector(".loading-page#loading-text"),
        dot_generate: document.querySelector(".loading-page#dot-generate"),
        ring_fallback: document.querySelectorAll(".loading-page.ring-fallback"),
        ring_container: document.querySelector(".loading-page#ring-container"),
        ring_fallback1: document.querySelector(".loading-page.ring-fallback#ring-fallback1"),
        ring_fallback2: document.querySelector(".loading-page.ring-fallback#ring-fallback2"),
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
            ["image/loading-page/profile pic.png", (obj) => {
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
            const loading_intervals = loading_page.variables.loading_intervals;
            const ring_container = loading_page.elements.ring_container;
            const loading_text = loading_page.elements.loading_text;
            const vignette = loading_page.elements.vignette;
            const main = loading_page.elements.main;

            loading_intervals.map(interval => {
                clearInterval(interval);
            });

            loading_text.textContent = "Done!";
            loading_text.style.opacity = "0";

            ring_container.style.transform = "rotateY(360deg) scale(0.4)";

            await wait(750);

            ring_container.classList.add("transition");
            main.classList.add("transition");

            await wait(1300);

            ring_container.style.transition = "transform 0.3s ease";
            ring_container.style.transform = "translateY(-50px) rotateY(360deg) scale(0.4)";
            vignette.style.opacity = '1';
            loading_page.functions_general.reveal_hello();
        },
        reveal_hello: async  () => {
            function random_letter() {
                return String.fromCharCode(Math.floor(Math.random() * (122 - 65 + 1) + 65))
            }
            async function randomize_hello_text() {
                while (!text_done) {
                [...hello_text.children].map(child => {
                    if (!child.classList.contains("done")) child.textContent = random_letter();
                });
                await wait(30);
            }
            }

            const hello_text = loading_page.elements.hello_text;
            const wait = global_functions.wait;
            let text_done = false;
            let index = 0;
            let interval_id;

            hello_text.style.opacity = "1";

            randomize_hello_text();

            interval_id = setInterval(() => {
                if (index < hello_text.children.length) {
                    const child = hello_text.children[index];
                    child.classList.add("done");
                    child.textContent = child.id == "exc" ? '!' : child.id;
                    index++;
                } else {
                    clearInterval(interval_id);
                    text_done = true;
                }
            }, 250)
        },
    },

    _init: () => {
        let loading_intervals = loading_page.variables.loading_intervals;
        loading_page.functions_general.load();

        loading_intervals.push(setInterval(loading_page.functions_general.dot_generate, 1000));
        loading_intervals.push(setInterval(loading_page.functions_general.ring_fallback, 4000));
    }
}
loading_page._init();
// console.log(new TextEncoder().encode(JSON.stringify(loading_page)).length)
});