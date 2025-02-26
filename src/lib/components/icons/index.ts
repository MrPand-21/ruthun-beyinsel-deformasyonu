import type { Icon as LucideIcon } from 'lucide-svelte';
import {
	ArrowRight,
	ChevronsUpDown,
	CircleDollarSign,
	Github,
	Home,
	Instagram,
	LayoutDashboard,
	Link,
	Linkedin,
	Loader2,
	Menu,
	ScrollText,
	Settings,
	Share,
	TriangleAlert,
	Twitter,
	UserPlus,
	Users2,
	X,
	Send,
	Loader,
	Moon,
	Sun,
	BookOpen
} from 'lucide-svelte';
import Google from './google.svelte';


export type Icon = LucideIcon;

export const Icons = {
	spinner: Loader2,
	camera: Instagram,
	link: Link,
	close: X,
	google: Google,
	select: ChevronsUpDown,
	dashboard: LayoutDashboard,
	documents: ScrollText,
	userPlus: UserPlus,
	users: Users2,
	dollarCircle: CircleDollarSign,
	settings: Settings,
	menu: Menu,
	arrowRight: ArrowRight,
	twitter: Twitter,
	github: Github,
	linkedin: Linkedin,
	home: Home,
	triangleAlert: TriangleAlert,
	share: Share,
	send: Send,
	x: X,
	loader: Loader,
	moon: Moon,
	sun: Sun,
	book: BookOpen,

};

export type IconType = any;
