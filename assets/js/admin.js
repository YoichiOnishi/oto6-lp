// DOM要素
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginForm = document.getElementById('login-form');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const saveChangesBtn = document.getElementById('save-changes-btn');
const previewBtn = document.getElementById('preview-btn');
const viewSiteBtn = document.getElementById('view-site-btn');

// セッションストレージキー
const AUTH_KEY = 'otoroku_admin_auth';
const SESSION_DURATION = 3600000; // 1時間（ミリ秒）

// ユーザードロップダウン
const userDropdown = document.getElementById('user-dropdown');
const dropdownMenu = document.getElementById('dropdown-menu');
const logoutBtn = document.getElementById('logout-btn');

// セクション保存ボタン
const allSaveBtns = document.querySelectorAll('button[id$="-save-btn"]');

// タブ関連
initializeTabs();

// ページ読み込み時の認証チェック
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// ログイン処理
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 実際にはAPIリクエストなどで認証を行うが、ここではモックとしてシンプルなチェック
    if (email === 'admin@example.com' && password === 'password') {
        loginSuccess();
    } else {
        showLoginError('メールアドレスまたはパスワードが正しくありません。');
    }
});

// ログインエラー表示
function showLoginError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'alert alert-danger';
    errorEl.style.marginBottom = '2rem';
    errorEl.innerHTML = `
        <span class="alert-icon">⚠️</span>
        <div class="alert-content">
            <p>${message}</p>
        </div>
    `;
    
    // 既存のエラーメッセージを削除
    const existingError = loginForm.querySelector('.alert');
    if (existingError) {
        existingError.remove();
    }
    
    // フォームの先頭に挿入
    loginForm.insertBefore(errorEl, loginForm.firstChild);
}

// ログイン成功時の処理
function loginSuccess() {
    // セッションストレージに認証情報を保存
    const authData = {
        timestamp: Date.now(),
        user: 'admin'
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    
    // 画面切り替え
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'flex';
}

// 認証チェック
function checkAuth() {
    const authData = JSON.parse(sessionStorage.getItem(AUTH_KEY));
    
    if (authData && (Date.now() - authData.timestamp < SESSION_DURATION)) {
        // 認証済みで有効期限内
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'flex';
    } else {
        // 未認証または期限切れ
        sessionStorage.removeItem(AUTH_KEY);
        loginContainer.style.display = 'flex';
        adminContainer.style.display = 'none';
    }
}

// ログアウト処理
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // セッションストレージから認証情報を削除
    sessionStorage.removeItem(AUTH_KEY);
    
    // 画面切り替え
    adminContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    dropdownMenu.classList.remove('show');
});

// サイドバートグル
sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('show');
});

// ナビゲーション
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // アクティブクラスを切り替え
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        this.classList.add('active');
        
        // ページタイトルを更新
        pageTitle.innerText = this.innerText.trim();
        
        // セクションコンテンツを切り替え
        const sectionId = this.getAttribute('data-section');
        
        // すべてのセクションコンテンツを非表示にする
        document.querySelectorAll('.section-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 対象のセクションを表示する
        const targetSection = document.getElementById(`${sectionId}-section`);
        
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // モバイルで開いている場合はサイドバーを閉じる
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
        }
    });
});

// ユーザードロップダウン
userDropdown.addEventListener('click', function() {
    dropdownMenu.classList.toggle('show');
});

// ドロップダウン外クリックで閉じる
document.addEventListener('click', function(e) {
    if (!userDropdown.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// タブ初期化
function initializeTabs() {
    const tabItems = document.querySelectorAll('.tab-item:not(.add-tab)');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabGroup = this.parentElement;
            const tabContents = tabGroup.parentElement.querySelectorAll('.tab-content');
            const tabId = this.getAttribute('data-tab');
            
            // タブのアクティブ状態を切り替え
            tabGroup.querySelectorAll('.tab-item:not(.add-tab)').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // タブコンテンツの表示を切り替え
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(`${tabId}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 特徴の追加ボタン
const addFeatureBtn = document.getElementById('add-feature-btn');
if (addFeatureBtn) {
    addFeatureBtn.addEventListener('click', function() {
        // 現在の特徴数を取得
        const featureTabs = document.querySelectorAll('.tab-item[data-tab^="feature-"]:not(.add-tab)');
        const nextFeatureNum = featureTabs.length + 1;
        
        // タブを追加
        const newTab = document.createElement('div');
        newTab.className = 'tab-item';
        newTab.setAttribute('data-tab', `feature-${nextFeatureNum}`);
        newTab.textContent = `特徴 ${nextFeatureNum}`;
        
        // タブをタブリストに追加（追加ボタンの前に）
        const tabsList = document.querySelector('#features-form .tabs');
        tabsList.insertBefore(newTab, addFeatureBtn);
        
        // タブコンテンツを作成
        const newTabContent = document.createElement('div');
        newTabContent.className = 'tab-content';
        newTabContent.id = `feature-${nextFeatureNum}-content`;
        newTabContent.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="feature-${nextFeatureNum}-title" class="form-label">特徴タイトル</label>
                    <input type="text" id="feature-${nextFeatureNum}-title" class="form-input" value="新しい特徴" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="feature-${nextFeatureNum}-icon" class="form-label">アイコン (絵文字)</label>
                    <input type="text" id="feature-${nextFeatureNum}-icon" class="form-input" value="✨" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="feature-${nextFeatureNum}-description" class="form-label">説明文</label>
                    <textarea id="feature-${nextFeatureNum}-description" class="form-input" required>ここに説明文を入力してください。</textarea>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" data-action="delete-feature" data-id="${nextFeatureNum}">
                        <span class="btn-icon">🗑️</span> この特徴を削除
                    </button>
                </div>
            </div>
        `;
        
        // タブコンテンツをフォームに追加
        const featuresForm = document.getElementById('features-form');
        featuresForm.appendChild(newTabContent);
        
        // 新しいタブをアクティブにする
        newTab.click();
        
        // 初期化
        initializeTabs();
        initializeDeleteButtons();
    });
}

// 効果の追加ボタン
const addBenefitBtn = document.getElementById('add-benefit-btn');
if (addBenefitBtn) {
    addBenefitBtn.addEventListener('click', function() {
        // 現在の効果数を取得
        const benefitTabs = document.querySelectorAll('.tab-item[data-tab^="benefit-"]:not(.add-tab)');
        const nextBenefitNum = benefitTabs.length + 1;
        
        // タブを追加
        const newTab = document.createElement('div');
        newTab.className = 'tab-item';
        newTab.setAttribute('data-tab', `benefit-${nextBenefitNum}`);
        newTab.textContent = `効果 ${nextBenefitNum}`;
        
        // タブをタブリストに追加（追加ボタンの前に）
        const tabsList = document.querySelector('#benefits-form .tabs');
        tabsList.insertBefore(newTab, addBenefitBtn);
        
        // タブコンテンツを作成
        const newTabContent = document.createElement('div');
        newTabContent.className = 'tab-content';
        newTabContent.id = `benefit-${nextBenefitNum}-content`;
        newTabContent.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="benefit-${nextBenefitNum}-title" class="form-label">効果タイトル</label>
                    <input type="text" id="benefit-${nextBenefitNum}-title" class="form-input" value="新しい効果" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="benefit-${nextBenefitNum}-icon" class="form-label">アイコン (絵文字)</label>
                    <input type="text" id="benefit-${nextBenefitNum}-icon" class="form-input" value="✨" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="benefit-${nextBenefitNum}-description" class="form-label">説明文</label>
                    <textarea id="benefit-${nextBenefitNum}-description" class="form-input" required>ここに説明文を入力してください。</textarea>
                </div>
            </div>
            
            <div class="form-row inline">
                <div class="form-group">
                    <label for="benefit-${nextBenefitNum}-before" class="form-label">導入前</label>
                    <input type="text" id="benefit-${nextBenefitNum}-before" class="form-input" value="導入前" required>
                </div>
                
                <div class="form-group">
                    <label for="benefit-${nextBenefitNum}-after" class="form-label">導入後</label>
                    <input type="text" id="benefit-${nextBenefitNum}-after" class="form-input" value="導入後" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" data-action="delete-benefit" data-id="${nextBenefitNum}">
                        <span class="btn-icon">🗑️</span> この効果を削除
                    </button>
                </div>
            </div>
        `;
        
        // タブコンテンツをフォームに追加
        const benefitsForm = document.getElementById('benefits-form');
        benefitsForm.appendChild(newTabContent);
        
        // 新しいタブをアクティブにする
        newTab.click();
        
        // 初期化
        initializeTabs();
        initializeDeleteButtons();
    });
}

// 導入事例の追加
const addCaseItemBtn = document.getElementById('add-case-item-btn');
if (addCaseItemBtn) {
    addCaseItemBtn.addEventListener('click', addNewCase);
}

// 事例追加ボタン（ヘッダー）
const addCaseBtn = document.getElementById('add-case-btn');
if (addCaseBtn) {
    addCaseBtn.addEventListener('click', addNewCase);
}

function addNewCase() {
    // 現在の事例数を取得
    const caseItems = document.querySelectorAll('.case-item');
    const nextCaseNum = caseItems.length + 1;
    
    // 新しい事例を作成
    const newCase = document.createElement('div');
    newCase.className = 'case-item';
    newCase.setAttribute('data-case-id', nextCaseNum);
    newCase.innerHTML = `
        <div class="case-header">
            <h3>事例 #${nextCaseNum}</h3>
            <div class="case-actions">
                <button type="button" class="case-action-btn" data-action="move-up">↑</button>
                <button type="button" class="case-action-btn" data-action="move-down">↓</button>
                <button type="button" class="case-action-btn danger" data-action="delete-case">🗑️</button>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="case-${nextCaseNum}-title" class="form-label">企業名/組織名</label>
                <input type="text" id="case-${nextCaseNum}-title" class="form-input" value="新しい導入先" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="case-${nextCaseNum}-description" class="form-label">導入事例詳細</label>
                <textarea id="case-${nextCaseNum}-description" class="form-input" required>ここに導入事例の詳細を入力してください。</textarea>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="case-${nextCaseNum}-logo" class="form-label">ロゴ画像</label>
                <div class="file-input-wrapper">
                    <button class="btn btn-outline">
                        <span class="btn-icon">📁</span>
                        画像を選択
                    </button>
                    <input type="file" id="case-${nextCaseNum}-logo" accept="image/*">
                </div>
            </div>
        </div>
    `;
    
    // 事例コンテナに追加
    const caseContainer = document.querySelector('.case-container');
    caseContainer.appendChild(newCase);
    
    // 事例アクションの初期化
    initializeCaseActions();
    
    // ファイル入力の初期化
    initializeFileInputs();
}

// FAQ追加
const addFaqItemBtn = document.getElementById('add-faq-item-btn');
if (addFaqItemBtn) {
    addFaqItemBtn.addEventListener('click', addNewFaq);
}

const addFaqBtn = document.getElementById('add-faq-btn');
if (addFaqBtn) {
    addFaqBtn.addEventListener('click', addNewFaq);
}

function addNewFaq() {
    // 現在のFAQ数を取得
    const faqItems = document.querySelectorAll('.faq-item');
    const nextFaqNum = faqItems.length + 1;
    
    // 新しいFAQを作成
    const newFaq = document.createElement('div');
    newFaq.className = 'faq-item';
    newFaq.setAttribute('data-faq-id', nextFaqNum);
    newFaq.innerHTML = `
        <div class="faq-header">
            <h3>質問 #${nextFaqNum}</h3>
            <div class="faq-actions">
                <button type="button" class="faq-action-btn" data-action="move-up">↑</button>
                <button type="button" class="faq-action-btn" data-action="move-down">↓</button>
                <button type="button" class="faq-action-btn danger" data-action="delete-faq">🗑️</button>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="faq-${nextFaqNum}-question" class="form-label">質問</label>
                <input type="text" id="faq-${nextFaqNum}-question" class="form-input" value="新しい質問" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="faq-${nextFaqNum}-answer" class="form-label">回答</label>
                <textarea id="faq-${nextFaqNum}-answer" class="form-input" rows="4" required>ここに回答を入力してください。</textarea>
            </div>
        </div>
    `;
    
    // FAQコンテナに追加
    const faqContainer = document.querySelector('.faq-container');
    faqContainer.appendChild(newFaq);
    
    // FAQアクションの初期化
    initializeFaqActions();
}

// 事例アクションの初期化
function initializeCaseActions() {
    // 上に移動
    document.querySelectorAll('.case-action-btn[data-action="move-up"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const caseItem = this.closest('.case-item');
            const prevItem = caseItem.previousElementSibling;
            
            if (prevItem && prevItem.classList.contains('case-item')) {
                caseItem.parentNode.insertBefore(caseItem, prevItem);
                updateCaseNumbers();
            }
        });
    });
    
    // 下に移動
    document.querySelectorAll('.case-action-btn[data-action="move-down"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const caseItem = this.closest('.case-item');
            const nextItem = caseItem.nextElementSibling;
            
            if (nextItem && nextItem.classList.contains('case-item')) {
                caseItem.parentNode.insertBefore(nextItem, caseItem);
                updateCaseNumbers();
            }
        });
    });
    
    // 削除
    document.querySelectorAll('.case-action-btn[data-action="delete-case"]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('この事例を削除してもよろしいですか？')) {
                const caseItem = this.closest('.case-item');
                caseItem.remove();
                updateCaseNumbers();
            }
        });
    });
}

// 事例番号の更新
function updateCaseNumbers() {
    const caseItems = document.querySelectorAll('.case-item');
    caseItems.forEach((item, index) => {
        const num = index + 1;
        item.setAttribute('data-case-id', num);
        item.querySelector('h3').textContent = `事例 #${num}`;
    });
}

// FAQ操作の初期化
function initializeFaqActions() {
    // 上に移動
    document.querySelectorAll('.faq-action-btn[data-action="move-up"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const prevItem = faqItem.previousElementSibling;
            
            if (prevItem && prevItem.classList.contains('faq-item')) {
                faqItem.parentNode.insertBefore(faqItem, prevItem);
                updateFaqNumbers();
            }
        });
    });
    
    // 下に移動
    document.querySelectorAll('.faq-action-btn[data-action="move-down"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const nextItem = faqItem.nextElementSibling;
            
            if (nextItem && nextItem.classList.contains('faq-item')) {
                faqItem.parentNode.insertBefore(nextItem, faqItem);
                updateFaqNumbers();
            }
        });
    });
    
    // 削除
    document.querySelectorAll('.faq-action-btn[data-action="delete-faq"]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('この質問を削除してもよろしいですか？')) {
                const faqItem = this.closest('.faq-item');
                faqItem.remove();
                updateFaqNumbers();
            }
        });
    });
}

// FAQ番号の更新
function updateFaqNumbers() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const num = index + 1;
        item.setAttribute('data-faq-id', num);
        item.querySelector('h3').textContent = `質問 #${num}`;
    });
}

// 削除ボタンの初期化
function initializeDeleteButtons() {
    // 特徴削除ボタン
    document.querySelectorAll('button[data-action="delete-feature"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const featureId = this.getAttribute('data-id');
            if (confirm(`特徴 ${featureId} を削除してもよろしいですか？`)) {
                // タブとコンテンツを削除
                const tab = document.querySelector(`.tab-item[data-tab="feature-${featureId}"]`);
                const content = document.getElementById(`feature-${featureId}-content`);
                
                if (tab && content) {
                    // 削除前にアクティブなタブかどうかチェック
                    const isActive = tab.classList.contains('active');
                    
                    // 削除
                    tab.remove();
                    content.remove();
                    
                    // アクティブだった場合は最初のタブをアクティブに
                    if (isActive) {
                        const firstFeatureTab = document.querySelector('.tab-item[data-tab^="feature-"]:not(.add-tab)');
                        if (firstFeatureTab) {
                            firstFeatureTab.click();
                        }
                    }
                }
            }
        });
    });
    
    // 効果削除ボタン
    document.querySelectorAll('button[data-action="delete-benefit"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const benefitId = this.getAttribute('data-id');
            if (confirm(`効果 ${benefitId} を削除してもよろしいですか？`)) {
                // タブとコンテンツを削除
                const tab = document.querySelector(`.tab-item[data-tab="benefit-${benefitId}"]`);
                const content = document.getElementById(`benefit-${benefitId}-content`);
                
                if (tab && content) {
                    // 削除前にアクティブなタブかどうかチェック
                    const isActive = tab.classList.contains('active');
                    
                    // 削除
                    tab.remove();
                    content.remove();
                    
                    // アクティブだった場合は最初のタブをアクティブに
                    if (isActive) {
                        const firstBenefitTab = document.querySelector('.tab-item[data-tab^="benefit-"]:not(.add-tab)');
                        if (firstBenefitTab) {
                            firstBenefitTab.click();
                        }
                    }
                }
            }
        });
    });
}

// ファイルプレビュー
function initializeFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                const inputGroup = this.closest('.form-group');
                
                reader.onload = function(e) {
                    // プレビュー要素があるか確認
                    let previewContainer = inputGroup.querySelector('.image-preview');
                    
                    // なければ作成
                    if (!previewContainer) {
                        previewContainer = document.createElement('div');
                        previewContainer.className = 'image-preview';
                        previewContainer.innerHTML = `
                            <img src="" alt="プレビュー">
                            <div class="image-actions">
                                <button class="image-action-btn">🔄</button>
                                <button class="image-action-btn danger">🗑️</button>
                            </div>
                        `;
                        inputGroup.appendChild(previewContainer);
                        
                        // 削除ボタンのイベント
                        const deleteBtn = previewContainer.querySelector('.image-action-btn.danger');
                        deleteBtn.addEventListener('click', function() {
                            if (confirm('この画像を削除しますか？')) {
                                input.value = '';
                                previewContainer.remove();
                            }
                        });
                        
                        // 更新ボタンのイベント
                        const updateBtn = previewContainer.querySelector('.image-action-btn:not(.danger)');
                        updateBtn.addEventListener('click', function() {
                            input.click();
                        });
                    }
                    
                    // 画像を更新
                    const img = previewContainer.querySelector('img');
                    img.src = e.target.result;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
}

// 初期化
initializeCaseActions();
initializeFaqActions();
initializeDeleteButtons();
initializeFileInputs();

// 保存操作のシミュレーション
function saveSection(sectionId) {
    // 成功メッセージ表示
    const successMessage = document.getElementById(`${sectionId}-success-message`);
    if (successMessage) {
        successMessage.style.display = 'flex';
        
        // 3秒後にメッセージを非表示にする
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    } else {
        // メッセージ要素がない場合はアラートで通知
        alert(`${sectionId}セクションの変更を保存しました`);
    }
    
    // ここで実際にはデータを保存する処理を行う
    // 例: フォームデータの取得と送信
    const form = document.getElementById(`${sectionId}-form`);
    if (form) {
        const formData = new FormData(form);
        console.log(`${sectionId} セクションのデータ:`, Object.fromEntries(formData));
        
        // 実際の実装では、ここでAPIリクエストなどを行う
        // fetch('/api/save-section', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch(error => console.error('Error:', error));
    }
}

// 各セクションの保存ボタンにイベントリスナーを追加
allSaveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const sectionId = btn.id.replace('-save-btn', '');
        saveSection(sectionId);
    });
});

// 全体の変更を保存
saveChangesBtn.addEventListener('click', function() {
    // 現在アクティブなセクションを特定
    const activeSection = document.querySelector('.section-content.active');
    if (activeSection) {
        const sectionId = activeSection.id.split('-')[0];
        saveSection(sectionId);
    }
});

// デモ用にすぐに管理画面を表示（本番では削除）
document.addEventListener('DOMContentLoaded', function() {
    // デモ用のログインスキップ
    // 通常は下記の行はコメントアウトする
    loginSuccess();
});