#!/usr/bin/env node

/**
 * 环境配置验证脚本
 * 用途：检查项目启动所需的环境变量是否正确配置
 * 使用：node scripts/check-env.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// ANSI 颜色代码
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFileExists(filename) {
    const filepath = join(rootDir, filename)
    return existsSync(filepath)
}

function readEnvFile(filename) {
    try {
        const filepath = join(rootDir, filename)
        const content = readFileSync(filepath, 'utf-8')
        const env = {}
        
        content.split('\n').forEach(line => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) return
            
            const match = trimmed.match(/^([^=]+)=(.*)$/)
            if (match) {
                env[match[1].trim()] = match[2].trim()
            }
        })
        
        return env
    } catch (error) {
        return null
    }
}

console.log('\n' + '='.repeat(60))
log('🔍 Anti-Fake News System - 环境配置检查', 'cyan')
console.log('='.repeat(60) + '\n')

// 1. 检查必需文件
log('📂 检查必需文件...', 'blue')
const requiredFiles = [
    { name: '.env.example', desc: '环境变量模板', required: true },
    { name: '.env.development', desc: '开发环境配置', required: true },
    { name: 'package.json', desc: '项目依赖配置', required: true },
    { name: 'vite.config.ts', desc: 'Vite 构建配置', required: true }
]

let filesOK = true
requiredFiles.forEach(file => {
    const exists = checkFileExists(file.name)
    if (exists) {
        log(`  ✅ ${file.name} - ${file.desc}`, 'green')
    } else {
        log(`  ❌ ${file.name} - ${file.desc} (缺失)`, 'red')
        if (file.required) filesOK = false
    }
})

if (!filesOK) {
    log('\n❌ 缺少必需文件，请先创建！', 'red')
    if (!checkFileExists('.env.development')) {
        log('\n💡 提示：运行以下命令创建开发环境配置：', 'yellow')
        log('   cp .env.example .env.development', 'yellow')
    }
    process.exit(1)
}

console.log()

// 2. 检查环境变量
log('⚙️  检查环境变量...', 'blue')
const env = readEnvFile('.env.development')

if (!env) {
    log('  ❌ 无法读取 .env.development 文件', 'red')
    process.exit(1)
}

const requiredEnvVars = [
    { key: 'VITE_API_BASE_URL', desc: '后端 API 地址', example: 'http://localhost:8080' },
    { key: 'VITE_FIREBASE_API_KEY', desc: 'Firebase API Key', example: 'AIzaSy...' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', desc: 'Firebase Auth Domain', example: 'project.firebaseapp.com' },
    { key: 'VITE_FIREBASE_PROJECT_ID', desc: 'Firebase Project ID', example: 'your-project-id' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', desc: 'Firebase Storage Bucket', example: 'project.firebasestorage.app' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', desc: 'Firebase Sender ID', example: '123456789' },
    { key: 'VITE_FIREBASE_APP_ID', desc: 'Firebase App ID', example: '1:123:web:abc' },
    { key: 'VITE_FIREBASE_MEASUREMENT_ID', desc: 'Firebase Measurement ID', example: 'G-XXXXXXXX' }
]

let envOK = true
const missingVars = []

requiredEnvVars.forEach(envVar => {
    const value = env[envVar.key]
    if (!value || value === 'your-api-key-here' || value.includes('your-')) {
        log(`  ❌ ${envVar.key} - ${envVar.desc} (未配置或使用默认值)`, 'red')
        missingVars.push(envVar)
        envOK = false
    } else {
        // 隐藏敏感信息
        const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value
        log(`  ✅ ${envVar.key} = ${displayValue}`, 'green')
    }
})

console.log()

// 3. 检查后端连接（可选）
log('🌐 检查后端 API 连接...', 'blue')
const apiUrl = env['VITE_API_BASE_URL']
if (apiUrl) {
    log(`  ℹ️  后端地址：${apiUrl}`, 'cyan')
    log(`  💡 提示：请确保后端服务已启动`, 'yellow')
} else {
    log(`  ⚠️  未配置后端地址`, 'yellow')
}

console.log()

// 4. 总结
console.log('='.repeat(60))
if (envOK) {
    log('✅ 配置检查通过！项目可以启动', 'green')
    log('\n🚀 运行以下命令启动项目：', 'cyan')
    log('   npm run dev', 'cyan')
} else {
    log('❌ 配置检查失败！', 'red')
    log('\n📝 缺少以下环境变量：', 'yellow')
    missingVars.forEach(v => {
        log(`   ${v.key} - ${v.desc}`, 'yellow')
        log(`   示例值：${v.example}`, 'yellow')
        console.log()
    })
    
    log('💡 解决方法：', 'cyan')
    log('   1. 打开 .env.development 文件', 'cyan')
    log('   2. 填写上述缺少的环境变量', 'cyan')
    log('   3. 从 Firebase Console 获取配置：https://console.firebase.google.com/', 'cyan')
    log('   4. 重新运行此脚本检查：node scripts/check-env.mjs', 'cyan')
    
    process.exit(1)
}

console.log('='.repeat(60) + '\n')
