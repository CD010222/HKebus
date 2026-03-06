import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme
}

const CORRECT_PASSWORD = 'chinaebus'
const modalId = 'vitepress-password-modal'
let passwordModalCreated = false
let passwordVerified = false

const checkPassword = () => {
  return new Promise((resolve) => {
    const storedPassword = sessionStorage.getItem('vitepress_password')
    if (storedPassword === CORRECT_PASSWORD) {
      passwordVerified = true
      resolve(true)
      return
    }
    
    if (!passwordModalCreated) {
      passwordModalCreated = true
      const modal = document.createElement('div')
      modal.id = modalId
      modal.innerHTML = `
        <style>
          #${modalId} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          #${modalId} .modal-content {
            background: #222;
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            min-width: 300px;
          }
          #${modalId} input {
            padding: 12px 20px;
            font-size: 18px;
            border: none;
            border-radius: 4px;
            width: 250px;
            margin-bottom: 15px;
          }
          #${modalId} button {
            padding: 12px 30px;
            font-size: 16px;
            background: #0078ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          #${modalId} button:hover {
            background: #0056b3;
          }
          #${modalId} .error {
            color: #ff4444;
            font-size: 14px;
            margin-top: 10px;
            display: none;
          }
        </style>
        <div class="modal-content">
          <h2>请输入访问密码</h2>
          <input type="password" id="password-input" placeholder="密码" />
          <button id="password-btn">确认</button>
          <div class="error" id="password-error">密码错误，请重试！</div>
        </div>
      `
      document.body.appendChild(modal)
      
      const input = document.getElementById('password-input')
      const btn = document.getElementById('password-btn')
      const errorTip = document.getElementById('password-error')
      
      const verify = () => {
        const val = input.value.trim()
        if (val === CORRECT_PASSWORD) {
          sessionStorage.setItem('vitepress_password', CORRECT_PASSWORD)
          passwordVerified = true
          document.body.removeChild(modal)
          passwordModalCreated = false
          resolve(true)
        } else {
          errorTip.style.display = 'block'
          input.value = ''
          setTimeout(() => { errorTip.style.display = 'none' }, 3000)
        }
      }
      
      btn.addEventListener('click', verify)
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify() })
    }
  })
}

if (typeof window !== 'undefined') {
  checkPassword()
}
