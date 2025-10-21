# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "Horse Racing Game" [level=1] [ref=e7]
        - button "🗑️ New Game" [ref=e12] [cursor=pointer]:
          - generic [ref=e13]: 🗑️
          - generic [ref=e14]: New Game
      - generic [ref=e15]:
        - generic [ref=e17]:
          - heading "Horses" [level=3] [ref=e19]
          - generic [ref=e21]:
            - generic [ref=e22]:
              - generic [ref=e23]: 🐎
              - heading "Ready to Race?" [level=2] [ref=e24]
              - paragraph [ref=e25]: Generate horses and start racing!
            - button "Generate horses" [ref=e26] [cursor=pointer]:
              - generic [ref=e27]: Generate horses
        - generic [ref=e30]:
          - generic [ref=e31]:
            - generic [ref=e32]: 📅
            - heading "Create Race Schedule" [level=2] [ref=e33]
            - paragraph [ref=e34]: Generate horses first to create a schedule
          - button "Generate Schedule" [disabled] [ref=e36]
  - generic "Toggle devtools panel" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
```