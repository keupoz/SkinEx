import { querySelector } from "@keupoz/strict-queryselector";
import { Dropdown } from "./components/common/Dropdown";
import { TemplateFunction } from "./utils";

export type Servers = [string, TemplateFunction][];

export class ServerManager {
    private readonly $form: HTMLFormElement;
    private readonly $nickname: HTMLInputElement;
    private readonly $error: HTMLElement;

    private readonly servers: Map<string, TemplateFunction>;
    private currentServer: string;

    constructor(servers: Servers, onFetch: (blob: Blob, nickname: string) => void) {
        this.servers = new Map(servers);
        const dropdownOptions = Array.from(this.servers.keys());
        this.currentServer = dropdownOptions[0];

        new Dropdown("#skin-servers", dropdownOptions, [this.currentServer], 1, (selected) => {
            this.currentServer = selected[0];
        });

        this.$form = querySelector("#skin-retriever", HTMLFormElement);
        this.$nickname = querySelector("#skin-retriever-nickname", HTMLInputElement);
        this.$error = querySelector("#skin-retriever-error", HTMLElement);

        this.$form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nickname = this.$nickname.value;

            if (!nickname) return;

            this.$error.setAttribute("hidden", "hidden");
            this.$error.innerText = "";
            this.$form.classList.add("disabled");

            try {
                const blob = await this.fetch(this.currentServer, nickname);
                onFetch(blob, nickname);
            } catch (err) {
                console.error("Error occurred while downloading skin", err);
                this.$error.innerText = err instanceof Error ? err.message : String(err);
                this.$error.removeAttribute("hidden");
            }

            this.$form.classList.remove("disabled");
        });
    }

    public async fetchCustom(url: string) {
        const response = await fetch(url);

        if (response.status !== 200) {
            const contentType = response.headers.get("Content-Type");

            if (contentType && contentType === "application/json") {
                const json = await response.json();
                if (typeof json.error === "string") throw new Error(json.error);
            }

            throw new Error("Couldn't download skin");
        }

        return await response.blob();
    }

    public fetch(server: string, nickname: string) {
        const template = this.servers.get(server);
        if (!template) throw new Error(`Unknown server "${server}"`);
        return this.fetchCustom(template(nickname));
    }
}
