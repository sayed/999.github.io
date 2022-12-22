// Publish project specific data
(function() {
rh = window.rh;
model = rh.model;
var defaultTopic = "مقدمة.htm";
rh._.exports(defaultTopic);
rh.consts('DEFAULT_TOPIC', encodeURI("مقدمة.htm"));
rh.consts('HOME_FILEPATH', encodeURI('index.htm'));
rh.consts('START_FILEPATH', encodeURI('index.htm'));
rh.consts('HELP_ID', '084f6281-caa8-4941-a1fb-3c583085e4ec' || 'preview');
rh.consts('LNG_SUBSTR_SEARCH', 0);

model.publish(rh.consts('KEY_LNG_NAME'), "ar");
model.publish(rh.consts('KEY_DIR'), "ltr");
model.publish(rh.consts('KEY_LNG'), {"Contents":"المحتويات","Index":"فهرس","Search":"بحث","Glossary":"المفردات","Logo/Author":"مدعوم من","Show":"إظهار","Hide":"إخفاء","SyncToc":"SyncToc","Prev":"السابق","Next":"التالي","Disabled Prev":"<<","Disabled Next":">>;","Separator":"|","OpenLinkInNewTab":"فتح في علامة تبويب جديدة","SearchOptions":"خيارات البحث","Loading":"يجري الآن التحميل...","UnknownError":"خطأ غير معروف","Logo":"شعار","HomeButton":"الصفحة الرئيسية","SearchPageTitle":"نتائج البحث","PreviousLabel":"السابق","NextLabel":"التالي","TopicsNotFound":"لم يتم العثور على نتائج","JS_alert_LoadXmlFailed":"فشل تحميل ملف XML","JS_alert_InitDatabaseFailed":"فشل في تهيئة قاعدة البيانات","JS_alert_InvalidExpression_1":"سلسلة البحث التي كتبتها ليست صالحة.","Searching":"يجري الآن البحث...","Cancel":"إلغاء","Canceled":"تم الإلغاء","ResultsFoundText":"%1 نتيجة (نتائج) تم العثور عليها لـ %2","SearchResultsPerScreen":"نتائج البحث حسب الصفحة","Back":"الخلف","TableOfContents":"جدول المحتويات","IndexFilterKewords":"الكلمات الأساسية للتصفية","GlossaryFilterTerms":"تصفية المصطلحات","ShowAll":"الكل","HideAll":"إخفاء الكل","ShowHide":"إظهار/إخفاء","IeCompatibilityErrorMsg":"لا يمكن مشاهدة هذه الصفحة في Internet Explorer 8 أو أي نسخ أقدم.","NoScriptErrorMsg":"قم بتمكين دعم JavaScript في المتصفح لمشاهدة هذه الصفحة.","EnableAndSearch":"تضمين جميع الكلمات في البحث","HighlightSearchResults":"تمييز نتائج البحث","Print":"طباعة","Filter":"عامل التصفية","SearchTitle":"بحث","ContentFilterChanged":"تغيّر عامل تصفية المحتوى، ابحث مرة أخرى","EndOfResults":"نهاية نتائج البحث.","Reset":"إعادة تعيين","NavTip":"إغلاق","ToTopTip":"الانتقال إلى الأعلى","ApplyTip":"تطبيق","SidebarToggleTip":"توسيع/طي","Copyright":"© Copyright 2019. All rights reserved.","FavoriteBoxTitle":"المفضّلات","setAsFavorites":"أضف للمفضلات","unsetAsFavorite":"عدم تحديد كمفضّلة","favoritesNameLabel":"الاسم","favoritesLabel":"المفضّلات","setAsFavorite":"التحديد كمفضّلة","nofavoritesFound":"لم تقم بتحديد أي موضوع كمفضّل.","Welcome_header":"مرحبًا بك في مركز المساعدة","Welcome_text":"ما المساعدة التي يمكننا تقديمها لك اليوم؟","SearchButtonTitle":"البحث عن...","ShowTopicInContext":"انقر هنا لقراءة الصفحة كاملة","TopicHiddenText":"يتم تصفية هذا الموضوع بواسطة عوامل التصفية المحددة.","NoTermsFound":"لم يتم العثور على مصطلحات","NoKeywordFound":"لم يتم العثور على كلمات أساسية","SkipToMainContent":"التخطي إلى المحتوى الرئيسي","SearchPaginationLabel":"%1 إلى %2 من %3 من النتائج","NextSearchResults":"صفحة البحث التالية","PrevSearchResults":"صفحة البحث السابقة"});

model.publish(rh.consts('KEY_HEADER_TITLE'), "مقترح لمخرجات قاعدة بيانات ترصد السياسة الخارجية للصين - إفريقيا كمثال");
model.publish(rh.consts('PDF_FILE_NAME'), "");
model.publish(rh.consts('MAX_SEARCH_RESULTS'), "20");
model.publish(rh.consts('KEY_SKIN_FOLDER_NAME'), "Azure_Blue");
model.publish(rh.consts('CHAT_API_SESSION_TOKEN'), "");
model.publish(rh.consts('CHAT_API_PROJ_ID'), "");

model.publish(rh.consts('KEY_SUBSTR_SEARCH'), "");
model.publish(rh.consts('KEY_LOGO_URL'), "");
model.publish(rh.consts('KEY_SPECIAL_CHARS'), "0;1;2;3;4;5;6;7;8;9");
})();
