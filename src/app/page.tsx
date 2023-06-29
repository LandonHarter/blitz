'use client'

import Footer from './components/footer/footer';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className={styles.hero_background_1}>
          <div className={styles.hero_content_1}>
            <h1 className={styles.hero_title_1}>Fuel your education for <span className={styles.hero_gradient_word_1}>free</span></h1>
            <p className={styles.hero_subtitle_1}>For everyone, no matter your level</p>
            <div className={styles.hero_buttons_container_1}>
              <Link href='/explore/sets'><button className={styles.hero_button_1}>Get started</button></Link>
              <Link href='/about'><button className={styles.hero_button_2}>Learn more</button></Link>
            </div>
            <div className={styles.hero_graphic_1}>
              <svg width="977" height="608" viewBox="0 0 977 608" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect x="797" y="228" width="64" height="64" rx="4" fill="#B5F2E3"/>
                <circle cx="101.5" cy="386.5" r="89.5" fill="#FACFCA"/>
                <path d="M62.4773 2.7887L6.59841 26.6789C3.71756 27.9106 3.30694 31.8261 5.86959 33.6286L53.6501 67.2369C56.0957 68.9571 59.4952 67.4839 59.9122 64.5231L68.0106 7.02454C68.4451 3.93951 65.3419 1.56397 62.4773 2.7887Z" fill="#F8AEC3"/>
                <circle cx="904" cy="99" r="16" fill="#FED385"/>
                <g filter="url(#filter0_dd_3250_4)">
                <rect x="115" y="36" width="719" height="533" rx="18" fill="white"/>
                </g>
                <path d="M114 54C114 44.0589 122.059 36 132 36H816C825.941 36 834 44.0589 834 54V68H114V54Z" fill="#BDC2D5"/>
                <circle cx="135" cy="52" r="4" fill="white"/>
                <circle cx="149" cy="52" r="4" fill="white"/>
                <circle cx="163" cy="52" r="4" fill="white"/>
                <path d="M644.952 290.672C644.064 293.781 629.85 368.845 654.279 438.579C658.277 439.467 657.833 428.363 657.833 428.363L653.391 332.867L655.612 296.89L644.952 290.672Z" fill="#DE8E68"/>
                <path d="M711.577 570.053H668.493C668.493 570.053 653.835 418.592 653.835 415.483C656.5 418.148 656.056 419.036 667.16 422.145C673.823 429.252 720.904 547.4 720.904 547.4L711.577 570.053Z" fill="#56CAD8"/>
                <path d="M690.172 234.262C710.928 240.201 694.539 303.601 686.855 308.914C679.17 314.226 643.149 299.275 640.244 292.55C637.339 285.826 660.786 225.854 690.172 234.262Z" fill="#FCC486"/>
                <path d="M708.912 217.384C775.093 217.384 776.425 407.487 767.098 415.482C757.77 423.477 662.274 431.028 653.835 415.482C645.396 399.937 636.957 217.384 708.912 217.384Z" fill="#FED385"/>
                <path d="M732.897 230.265C750.219 217.384 790.639 268.908 790.194 278.235C789.75 287.563 755.994 307.106 748.887 305.329C741.78 303.553 708.37 248.503 732.897 230.265Z" fill="#FED892"/>
                <path d="M783.976 280.012C800.41 307.106 804.852 343.083 804.852 349.302C804.852 366.18 796.413 374.619 791.083 374.619C769.763 374.619 699.584 320.431 694.699 315.989C689.813 311.548 704.026 298.223 706.247 300.443C708.468 302.664 733.785 318.654 770.651 334.644C765.321 327.982 749.775 307.994 749.331 301.776C748.887 295.558 783.976 280.012 783.976 280.012Z" fill="#DE8E68"/>
                <path d="M685.137 267.04L657.389 271.227L664.565 318.792L692.314 314.605L685.137 267.04Z" fill="#333333"/>
                <path d="M705.349 310.549C708.66 304.813 704.887 296.434 696.92 291.835C688.954 287.235 679.811 288.156 676.499 293.892C673.188 299.628 676.961 308.007 684.928 312.606C692.894 317.206 702.037 316.284 705.349 310.549Z" fill="#DE8E68"/>
                <path d="M720.46 225.823C720.46 231.597 697.364 232.042 697.364 225.823V190.734H720.46V225.823Z" fill="#D37C59"/>
                <path d="M702.916 211.61C715.549 211.61 725.79 193.414 725.79 170.969C725.79 148.523 715.549 130.327 702.916 130.327C690.282 130.327 680.041 148.523 680.041 170.969C680.041 193.414 690.282 211.61 702.916 211.61Z" fill="#DE8E68"/>
                <path d="M724.236 182.739C727.547 182.739 730.232 180.055 730.232 176.743C730.232 173.431 727.547 170.747 724.236 170.747C720.924 170.747 718.239 173.431 718.239 176.743C718.239 180.055 720.924 182.739 724.236 182.739Z" fill="#DE8E68"/>
                <path d="M802.187 124.553C784.864 124.553 770.651 136.99 751.996 136.99C738.671 136.99 725.79 121 707.135 121C683.15 121 675.599 133.881 675.599 142.764C675.599 149.871 680.041 157.866 681.374 157.866C681.374 155.645 684.039 147.65 684.927 146.762C685.815 149.871 704.47 171.635 720.904 171.635V171.759C721.807 171.155 722.857 170.808 723.942 170.754C725.027 170.7 726.106 170.942 727.064 171.454C728.022 171.965 728.823 172.728 729.382 173.659C729.94 174.591 730.235 175.657 730.235 176.743C730.235 177.829 729.94 178.895 729.382 179.826C728.823 180.758 728.022 181.52 727.064 182.032C726.106 182.544 725.027 182.786 723.942 182.732C722.857 182.678 721.807 182.33 720.904 181.726V194.732H725.346C731.12 194.732 733.785 192.511 742.669 192.511C758.214 192.511 779.979 211.61 806.629 211.61C835.499 211.61 847.492 189.846 847.492 165.417C847.492 132.992 816.844 124.553 802.187 124.553Z" fill="black"/>
                <path d="M767.098 415.483V570.053H711.577L667.107 422.043C682.706 424.81 741.78 427.031 767.098 415.483Z" fill="#74D5DE"/>
                <circle cx="101.5" cy="188.5" r="31.5" fill="#74D5DE"/>
                <mask id="mask0_3250_4" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="70" y="157" width="63" height="63">
                <circle cx="101.5" cy="188.5" r="31.5" fill="#74D5DE"/>
                </mask>
                <g mask="url(#mask0_3250_4)">
                <rect x="74" y="162" width="56" height="60" fill="url(#pattern0)"/>
                </g>
                <rect x="257" y="115" width="289" height="12" fill="#DFE0EB"/>
                <rect x="257" y="142" width="201" height="6" fill="#DFE0EB"/>
                <circle cx="196" cy="130" r="24" fill="#FED892"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M538 342C542.418 342 546 345.582 546 350V399C546 403.418 542.418 407 538 407H522.676L525.5 415L507.618 407H336C331.582 407 328 403.418 328 399V350C328 345.582 331.582 342 336 342H538Z" fill="#DFE0EB"/>
                <rect x="360" y="364" width="155" height="6" fill="white"/>
                <rect x="359" y="376" width="54" height="6" fill="white"/>
                <ellipse cx="12.5" cy="12" rx="12.5" ry="12" transform="matrix(-1 0 0 1 571 431)" fill="#FACFCA"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M206 225C201.582 225 198 228.582 198 233V282C198 286.418 201.582 290 206 290H221.324L218.5 298L236.382 290H362C366.418 290 370 286.418 370 282V233C370 228.582 366.418 225 362 225H206Z" fill="#DFE0EB"/>
                <rect x="227" y="244" width="115" height="6" fill="white"/>
                <rect x="227" y="256" width="74" height="6" fill="white"/>
                <ellipse cx="185.5" cy="326" rx="12.5" ry="12" fill="#FACFCA"/>
                <rect x="172" y="486" width="399" height="28" rx="8" fill="#DFE0EB"/>
                <rect x="211" y="491" width="17" height="3" transform="rotate(90 211 491)" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M189.6 507.8C184.961 507.8 181.2 504.039 181.2 499.4C181.2 494.761 184.961 491 189.6 491C194.239 491 198 494.761 198 499.4C198 504.039 194.239 507.8 189.6 507.8ZM189.6 505.6C186.507 505.6 184.2 503.417 184.2 500.6C184.2 500.3 186.507 501.285 189.6 501.285C192.693 501.285 195 500.3 195 500.6C195 503.417 192.693 505.6 189.6 505.6ZM191.9 499.4C191.403 499.4 191 498.37 191 497.1C191 495.83 191.403 494.8 191.9 494.8C192.397 494.8 192.8 495.83 192.8 497.1C192.8 498.37 192.397 499.4 191.9 499.4ZM187.3 499.4C186.803 499.4 186.4 498.37 186.4 497.1C186.4 495.83 186.803 494.8 187.3 494.8C187.797 494.8 188.2 495.83 188.2 497.1C188.2 498.37 187.797 499.4 187.3 499.4Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M547 499.5H561L547 495V499.5ZM547 501H561L547 505.5V501Z" fill="white"/>
                <defs>
                <filter id="filter0_dd_3250_4" x="90" y="25" width="769" height="583" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="14"/>
                <feGaussianBlur stdDeviation="12.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.529412 0 0 0 0 0.572549 0 0 0 0 0.631373 0 0 0 0.06 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3250_4"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.529412 0 0 0 0 0.572549 0 0 0 0 0.631373 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_3250_4" result="effect2_dropShadow_3250_4"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3250_4" result="shape"/>
                </filter>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_3250_4" transform="matrix(0.00483092 0 0 0.00450886 0 -0.00273752)"/>
                </pattern>
                <image id="image0_3250_4" width="207" height="223" xlinkHref="data:image/png;base64,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"/>
                </defs>
              </svg>
            </div>
          </div>
      </div>
    
      <Footer />
    </div>
  );
}