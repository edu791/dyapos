require.config({
	paths : {
		"App"									: "editor/App",
		"Collaborative/ChatWindowView"			: "editor/Collaborative/ChatWindowView",
		"Collaborative/User"					: "editor/Collaborative/User",
		"Component/ComponentModel"				: "editor/Component/ComponentModel",
		"Component/ComponentView"				: "editor/Component/ComponentView",
		"Component/Image/ImageModel"			: "editor/Component/Image/ImageModel",
		"Component/Image/ImageToolboxView"		: "editor/Component/Image/ImageToolboxView",
		"Component/Image/ImageUploadFormView"	: "editor/Component/Image/ImageUploadFormView",
		"Component/Image/ImageView"				: "editor/Component/Image/ImageView",
		"Component/NewComponentBoxView"			: "editor/Component/NewComponentBoxView",
		"Component/Text/AddLinkWindowView"		: "editor/Component/Text/AddLinkWindowView",
		"Component/Text/TextModel"				: "editor/Component/Text/TextModel",
		"Component/Text/TextToolboxView"		: "editor/Component/Text/TextToolboxView",
		"Component/Text/TextView"				: "editor/Component/Text/TextView",
		"Component/Video/VideoModel"			: "editor/Component/Video/VideoModel",
		"Component/Video/VideoToolboxView"		: "editor/Component/Video/VideoToolboxView",
		"Component/Video/VideoUploadFormView"	: "editor/Component/Video/VideoUploadFormView",
		"Component/Video/VideoView"				: "editor/Component/Video/VideoView",
		"EditorView"							: "editor/EditorView",
		"Mode/EditModeView"						: "editor/Mode/EditModeView",
		"Mode/NavigationModeView"				: "editor/Mode/NavigationModeView",
		"Slide/SlideMiniView"					: "editor/Slide/SlideMiniView",
		"Slide/SlideModel"						: "editor/Slide/SlideModel",
		"Slide/SlideOptionsBoxView"				: "editor/Slide/SlideOptionsBoxView",
		"Slide/SlidesListView"					: "editor/Slide/SlidesListView",
		"Slide/SlidesMapView"					: "editor/Slide/SlidesMapView",
		"Slide/SlideNotesView"					: "editor/Slide/SlideNotesView",
		"Slide/SlideView"						: "editor/Slide/SlideView",
		"Theme/ThemeEditorView"					: "editor/Theme/ThemeEditorView",
		"Theme/ThemeSelectorView"				: "editor/Theme/ThemeSelectorView"
	}
});

// Here the application starts
require(["edit", "App"]);
