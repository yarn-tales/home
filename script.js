document.addEventListener('DOMContentLoaded', () => {
    // Current year for footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Form Submission Handling
    const orderForm = document.getElementById('orderForm');
    const formStatus = document.getElementById('formStatus');

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(orderForm);
            
            // Provide visual feedback before submission
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(orderForm.action, {
                    method: orderForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
                    formStatus.innerHTML = '<span style="color: green; margin-top: 15px; display: block; font-weight: bold;">تم إرسال طلبك بنجاح! سنتواصل معك قريباً.</span>';
                    orderForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                            formStatus.innerHTML = '<span style="color: red; margin-top: 15px; display: block; font-weight: bold;">' + data["errors"].map(error => error["message"]).join(", ") + '</span>';
                        } else {
                            formStatus.innerHTML = '<span style="color: red; margin-top: 15px; display: block; font-weight: bold;">عذراً، حدث خطأ أثناء إرسال الطلب.</span>';
                        }
                    })
                }
            } catch (error) {
                formStatus.innerHTML = '<span style="color: red; margin-top: 15px; display: block; font-weight: bold;">عذراً، حدث خطأ أثناء إرسال الطلب. يرجى التأكد من اتصالك بالإنترنت.</span>';
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Image Modal logic setup
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('img01');
    const captionText = document.getElementById('caption');
    const span = document.getElementsByClassName('close-modal')[0];

    // Export function to global scope properly for inline onclick
    window.openModal = function(element) {
        const img = element.querySelector('img');
        const overlayTitle = element.querySelector('h3').innerText;
        const overlayDesc = element.querySelector('p').innerText;
        
        modal.style.display = "block";
        modalImg.src = img.src;
        captionText.innerHTML = `<strong>${overlayTitle}</strong><br>${overlayDesc}`;
    }

    // Close modal via close button
    if (span) {
        span.onclick = function() { 
            modal.style.display = "none";
        }
    }

    // Close modal by clicking outside the image
    if (modal) {
        modal.onclick = function(e) {
            if (e.target !== modalImg) {
                modal.style.display = "none";
            }
        }
    }
});
