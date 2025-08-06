import './bootstrap';
import Clipboard from '@ryangjchandler/alpine-clipboard';
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
Alpine.plugin(Clipboard);
Livewire.start();
