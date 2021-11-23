const invoices = require("./data/invoices.json");
const plays = require("./data/plays.json");

function statement(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} 석)\n`; // 변수 인라인
  }

  result += `총액: ${usd(totalAmount(invoice))}\n`;
  result += `적립 포인트: ${totalVolumeCredits(invoice)} 점\n`; // 값 계산 로직을 함수로 추출 & 변수 인라인
  return result;
}

// 필요 없어진 매개변수 제거
function amountFor(aPerformance) {
  let result = 0; // 변수를 초기화하는 코드
  switch (playFor(aPerformance).type) { // play를 playFor() 호출로 변경
    case "tragedy": // 비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy": // 희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`); // play를 playFor() 호출로 변경
  }
  return result; // 함수 안에서 값이 바뀌는 변수 반환
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === playFor(perf).type)
    result += Math.floor(perf.audience / 5);
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
                      { style: "currency", currency: "USD",
                        minimumFractionDigits: 2 }).format(aNumber/100);
}

function totalVolumeCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function totalAmount(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}

function main() {
  try {
    console.log(statement(invoices[0], plays));
  } catch (error) {
    console.error(error);
  }
}

main();
