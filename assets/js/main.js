// ヘッダースクロール効果
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// モバイルナビゲーション
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
});

// ナビゲーションリンククリック時にメニューを閉じる
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    });
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ アコーディオン
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
        // 現在開いているアイテムを閉じる
        const currentActive = document.querySelector('.accordion-item.active');
        if (currentActive && currentActive !== item) {
            currentActive.classList.remove('active');
        }
        
        // クリックされたアイテムの状態を切り替え
        item.classList.toggle('active');
    });
});

// 料金プラン月払い/年払い切り替え
document.addEventListener('DOMContentLoaded', function() {
    const monthlyBtn = document.getElementById('monthly-btn');
    const yearlyBtn = document.getElementById('yearly-btn');
    const toggleSlider = document.getElementById('pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    // トグルスライダーの初期位置を設定
    function updateToggleSlider() {
        if (yearlyBtn.classList.contains('active')) {
            toggleSlider.style.left = yearlyBtn.offsetLeft + 'px';
        } else {
            toggleSlider.style.left = monthlyBtn.offsetLeft + 'px';
        }
    }
    
    // 初期位置を設定
    setTimeout(updateToggleSlider, 0);
    
    // 月払いボタンクリック
    monthlyBtn.addEventListener('click', function() {
        yearlyBtn.classList.remove('active');
        monthlyBtn.classList.add('active');
        toggleSlider.style.left = monthlyBtn.offsetLeft + 'px';
        
        // 料金表示を切り替え
        monthlyPrices.forEach(price => price.style.display = 'block');
        yearlyPrices.forEach(price => price.style.display = 'none');
    });
    
    // 年払いボタンクリック
    yearlyBtn.addEventListener('click', function() {
        monthlyBtn.classList.remove('active');
        yearlyBtn.classList.add('active');
        toggleSlider.style.left = yearlyBtn.offsetLeft + 'px';
        
        // 料金表示を切り替え
        monthlyPrices.forEach(price => price.style.display = 'none');
        yearlyPrices.forEach(price => price.style.display = 'block');
    });
    
    // ウィンドウリサイズ時にトグルスライダー位置を更新
    window.addEventListener('resize', updateToggleSlider);
});

// お問い合わせフォームのバリデーション
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // 必須フィールドのチェック
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // エラーメッセージが既に存在する場合は作成しない
                let errorMessage = field.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = '必須項目です';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                const errorMessage = field.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });
        
        // メールアドレスのバリデーション
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                
                let errorMessage = emailField.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = '有効なメールアドレスを入力してください';
                    emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
                }
            }
        }
        
        // 電話番号の任意バリデーション
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phonePattern = /^[0-9\-\+\s]+$/;
            if (!phonePattern.test(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('error');
                
                let errorMessage = phoneField.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = '有効な電話番号を入力してください';
                    phoneField.parentNode.insertBefore(errorMessage, phoneField.nextSibling);
                }
            } else {
                phoneField.classList.remove('error');
                const errorMessage = phoneField.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        }
        
        if (isValid) {
            // フォーム送信のスタイリング（実際はサーバーへのPOSTが必要）
            const formContainer = contactForm.closest('.contact-form-container');
            formContainer.innerHTML = '<div class="form-success"><h3>お問い合わせありがとうございます</h3><p>メッセージを受け付けました。担当者より順次ご連絡いたします。</p></div>';
            
            // 実際のシステムでは、ここでフォームデータをサーバーに送信
            // fetch('/contact', {
            //     method: 'POST',
            //     body: new FormData(contactForm),
            // })
            // .then(response => response.json())
            // .then(data => console.log(data))
            // .catch(error => console.error(error));
        }
    });
    
    // エラー表示のリアルタイムクリア
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // フェードインアニメーション用の要素を取得
    const fadeElements = document.querySelectorAll('.feature-card, .benefit-card, .case-card, .accordion-item, .pricing-card');
    
    // Intersection Observerの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // 一度表示されたら監視を止める
            }
        });
    }, { threshold: 0.1 }); // 10%見えたらトリガー
    
    // 監視を開始
    fadeElements.forEach(element => {
        element.classList.add('fade-element'); // アニメーション用のクラスを追加
        observer.observe(element);
    });
});

// アニメーション用のCSS
document.head.appendChild(document.createElement('style')).textContent = `
    .fade-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

// 構造化データの追加
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "音六AI",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "要問合せ",
        "priceCurrency": "JPY"
    },
    "description": "音声尺にフィットしたナレーション作成、読み・イントネーション指定機能、多言語ナレーション対応の音声合成システム",
    "developer": {
        "@type": "Organization",
        "name": "TBSメディアテクノロジー"
    }
};