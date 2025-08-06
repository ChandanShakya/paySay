import './bootstrap';
import Clipboard from '@ryangjchandler/alpine-clipboard';
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import { inject } from '@vercel/analytics';

inject();
Alpine.plugin(Clipboard);

Livewire.start();
