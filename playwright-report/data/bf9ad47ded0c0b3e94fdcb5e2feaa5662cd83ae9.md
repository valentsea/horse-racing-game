# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - generic [ref=e9]:
          - heading "🐎 Horses" [level=3] [ref=e10]:
            - generic [ref=e11]: 🐎
            - text: Horses
          - button "+ New Game" [ref=e12] [cursor=pointer]:
            - generic [ref=e13]: +
            - generic [ref=e14]: New Game
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: 🐎
            - heading "Ready to Race?" [level=2] [ref=e19]
            - paragraph [ref=e20]: Generate horses and start racing!
          - button "Generate horses" [ref=e21] [cursor=pointer]:
            - generic [ref=e22]: Generate horses
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]: 📅
          - heading "Create Race Schedule" [level=2] [ref=e28]
          - paragraph [ref=e29]: Generate horses first to create a schedule
        - button "Generate Schedule" [disabled] [ref=e31]
  - generic [ref=e32]:
    - generic "Toggle devtools panel" [ref=e33] [cursor=pointer]:
      - img [ref=e34]
    - generic "Toggle Component Inspector" [ref=e39] [cursor=pointer]:
      - img [ref=e40]
```