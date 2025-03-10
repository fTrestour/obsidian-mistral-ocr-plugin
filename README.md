# Mistral OCR for Obsidian

This plugin allows you to perform OCR (Optical Character Recognition) on images using the [Mistral AI](https://mistral.ai/) API directly within Obsidian. Extract text from screenshots, scanned documents, photos of text, PDFs, and other image-based content and easily integrate it into your notes.

## How to Use

1. Install the plugin
2. Add your Mistral API key in the plugin settings
3. Open a note where you want to insert the OCR text
4. Place your cursor at the desired position
5. Click the OCR icon in the left ribbon or use the "Run OCR on Image" command from the command palette
6. Select an image file from the file dialog
7. The text will be automatically extracted and inserted at the cursor position

### API Key Setup

1. Create an account at [Mistral AI Console](https://console.mistral.ai/signup/)
2. After logging in, navigate to the API Keys section
3. Create a new API key
4. Copy the key and paste it into the plugin settings in Obsidian

## Privacy & Security

-   Your images are processed by Mistral AI's servers according to their [privacy policy](https://mistral.ai/privacy/)
-   Your API key is stored locally in your Obsidian configuration and is only used to authenticate with Mistral's API
-   No image data is stored locally after processing
-   All text extraction is performed server-side by Mistral AI

## Third-Party Attribution

This plugin relies on the following third-party services:

-   **Mistral AI**: The OCR functionality is powered by [Mistral AI](https://mistral.ai/). Please refer to Mistral AI's [terms of service and privacy policy](https://mistral.ai/terms/) for details about how they process and handle your data.

## Development

### Building the Plugin

1. Clone the repository
2. Install dependencies with `npm install`
3. Build the plugin with `npm run build`

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
