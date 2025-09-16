#!/usr/bin/env node

/**
 * 📡 네트워크 개발 서버 스크립트
 * 
 * 사용방법:
 *   node dev-server.js
 *   또는
 *   npm run dev:network (package.json에 스크립트 추가 시)
 * 
 * 기능:
 *   - Next.js 개발 서버를 0.0.0.0 호스트로 시작
 *   - 같은 WiFi 네트워크의 다른 기기에서 접속 가능한 URL 자동 표시
 *   - 모바일 디바이스 테스트용으로 최적화
 * 
 * 예시 출력:
 *   📡 네트워크 접근 URL:
 *      로컬:     http://localhost:3000
 *      네트워크: http://192.168.1.100:3000
 */

const { spawn } = require('child_process');
const os = require('os');

console.log('🔄 Next.js 개발 서버를 시작합니다...\n');

// Next.js 개발 서버 환경 변수 설정
process.env.BROWSER = 'none'; // 자동 브라우저 열기 방지

// Next.js 개발 서버 시작 (next dev)
const devProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0'], {
  stdio: 'pipe',
  cwd: process.cwd(),
  env: { ...process.env }
});

let serverStarted = false;
let detectedPort = 3000; // 기본 포트를 3000으로 설정

// 네트워크 URL 출력 함수
function printNetworkUrls() {
  const interfaces = os.networkInterfaces();
  const urls = [];
  
  console.log('\n📡 네트워크 접근 URL:');
  console.log(`   로컬:     http://localhost:${detectedPort}`);
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const networkUrl = `http://${iface.address}:${detectedPort}`;
        console.log(`   네트워크: ${networkUrl}`);
        urls.push(networkUrl);
      }
    }
  }
  
  if (urls.length === 0) {
    console.log('   네트워크: 사용 가능한 네트워크 인터페이스가 없습니다.');
  }
  
  console.log('');
  console.log('🚀 같은 WiFi 네트워크의 다른 기기에서 위 네트워크 URL로 접속 가능합니다!');
  console.log('📱 모바일 디바이스에서 테스트하거나 다른 컴퓨터에서 확인해보세요.');
  console.log('');
}

// 서버 출력 모니터링
devProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // 포트 감지 시도
  if (!serverStarted) {
    // Next.js의 출력에서 포트 추출
    const portMatch = output.match(/(?:Local:|url:)\s+https?:\/\/(?:localhost|0\.0\.0\.0):(\d+)/i) ||
                      output.match(/port\s+(\d+)/i) ||
                      output.match(/:(\d+)/);
    if (portMatch) {
      detectedPort = parseInt(portMatch[1], 10);
    }
  }
  
  // 서버가 시작되었는지 확인 (Next.js의 "ready" 메시지 확인)
  if (!serverStarted && (
    output.includes('ready') || 
    output.includes('started server') || 
    output.includes('Local:') || 
    output.includes('compiled') ||
    output.includes('✓')
  )) {
    serverStarted = true;
    // 서버 시작 후 네트워크 URL 표시
    setTimeout(() => {
      printNetworkUrls();
    }, 1000);
  }
});

devProcess.stderr.on('data', (data) => {
  const output = data.toString();
  process.stderr.write(output);
  
  // stderr에서도 포트 정보를 찾을 수 있음
  if (!serverStarted) {
    const portMatch = output.match(/port\s+(\d+)/i);
    if (portMatch) {
      detectedPort = parseInt(portMatch[1], 10);
    }
  }
});

devProcess.on('close', (code) => {
  console.log(`\n개발 서버가 종료되었습니다. (코드: ${code})`);
  process.exit(code);
});

// Ctrl+C 처리
process.on('SIGINT', () => {
  console.log('\n🛑 개발 서버를 종료합니다...');
  devProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  devProcess.kill('SIGTERM');
});
