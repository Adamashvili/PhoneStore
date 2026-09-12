import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
// import '@n8n/chat/style.css';
// @ts-ignore: @n8n/chat does not currently provide TypeScript declarations.
import { createChat } from '@n8n/chat';

@Component({
    selector: 'app-root',
    imports: [RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'onlineShopping';
  constructor() {
    createChat({
	webhookUrl: 'https://adamashvili888.app.n8n.cloud/webhook/4865b2b8-19b8-4a9e-8f08-adceafe16515/chat',
  webhookConfig: {
		method: 'POST',
		headers: {}
	},
	target: '#n8n-chat',
	mode: 'window',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	loadPreviousSession: true,
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [
		'მოგესალმებათ Phone Store! 👋',
		'რით შემიძლია დაგეხმაროთ?'
	],
	i18n: {
		en: {
			title: 'Phone Store',
			subtitle: "თქვენი ონლაინ კონსულტანტი",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},
	enableStreaming: false,
});
  }
}
