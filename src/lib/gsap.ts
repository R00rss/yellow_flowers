import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, DrawSVGPlugin, SplitText)

gsap.defaults({ ease: 'power2.out' })

export { gsap, useGSAP, DrawSVGPlugin, SplitText }
