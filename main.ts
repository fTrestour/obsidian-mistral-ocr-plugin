import { Mistral } from '@mistralai/mistralai';
import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MistralOCRSettings {
	apiKey: string;
}

const DEFAULT_SETTINGS: MistralOCRSettings = {
	apiKey: '',
}

export default class MistralOCRPlugin extends Plugin {
	settings: MistralOCRSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('image-file', 'Mistral OCR', (evt: MouseEvent) => {
			this.selectImageAndProcess();
		});

		this.addCommand({
			id: 'run-ocr',
			name: 'Run OCR on Image',
			callback: () => {
				this.selectImageAndProcess();
			}
		});

		this.addSettingTab(new MistralOCRSettingTab(this.app, this));
	}

	async selectImageAndProcess() {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';
		document.body.appendChild(fileInput);

		fileInput.addEventListener('change', async () => {
			if (!fileInput.files || fileInput.files.length === 0) {
				document.body.removeChild(fileInput);
				return;
			}

			const file = fileInput.files[0];
			const reader = new FileReader();

			reader.onload = async (e) => {
				try {
					new Notice('Processing image...');

					// Get base64 image data
					const imageData = e.target?.result ? (e.target.result as string).split(',')[1] : '';
					if (!imageData) {
						throw new Error('Failed to read image data');
					}

					const ocrResult = await this.performOCR(imageData);

					this.insertTextAtCursor(ocrResult);

					document.body.removeChild(fileInput);
				} catch (error) {
					console.error('OCR error:', error);
					new Notice(`OCR failed: ${error.message}`);
					document.body.removeChild(fileInput);
				}
			};

			reader.readAsDataURL(file);
		});

		fileInput.click();
	}

	insertTextAtCursor(text: string) {
		if (!text) {
			new Notice('No text was extracted from the image');
			return;
		}

		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor;
			editor.replaceSelection(text);
			new Notice('OCR text inserted');
		} else {
			new Notice('No active note to insert into');
		}
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async performOCR(imageData: string): Promise<string> {
		if (!this.settings.apiKey) {
			new Notice('Please set your Mistral API key in settings');
			return '';
		}

		try {
			const client = new Mistral({ apiKey: this.settings.apiKey });

			const ocrResponse = await client.ocr.process({
				model: "mistral-ocr-latest",
				document: {
					type: "image_url",
					imageUrl: `data:image/jpeg;base64,${imageData}`
				}
			});

			let extractedText = '';
			if (ocrResponse.pages && ocrResponse.pages.length > 0) {
				extractedText = ocrResponse.pages.map(page => page.markdown).join('\n\n');
			}

			return extractedText;
		} catch (error) {
			console.error('OCR error:', error);
			new Notice(`OCR failed: ${error.message}`);
			return '';
		}
	}
}

class MistralOCRSettingTab extends PluginSettingTab {
	plugin: MistralOCRPlugin;

	constructor(app: App, plugin: MistralOCRPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Mistral OCR Settings' });

		new Setting(containerEl)
			.setName('Mistral API Key')
			.setDesc('Enter your Mistral API key')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));
	}
}