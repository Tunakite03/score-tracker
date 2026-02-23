export type Language = 'en' | 'vi';

export const translations = {
   en: {
      // Common
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      close: 'Close',

      // Navigation
      sessions: 'Sessions',
      stats: 'Stats',

      // Path/PWD
      'pwd.home': 'home',

      // Settings
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      general: 'General',

      // Languages
      english: 'English',
      vietnamese: 'Vietnamese',

      // Themes
      light: 'Light',
      dark: 'Dark',
      system: 'System',

      // Session List
      scoreTracker: 'Score Tracker',
      newSession: 'New Session',
      noSessions: 'No sessions yet',
      createFirstSession: 'Create your first session to start tracking scores',
      enterSessionName: 'Enter session name...',
      creating: 'Creating...',
      deleteSession: 'Delete Session',
      deleteSessionConfirm:
         'Are you sure you want to delete "{name}"? This will permanently delete all players, rounds, and scores. This action cannot be undone.',
      errorDeletingSession: 'Failed to delete session',

      // Session Dashboard
      round: 'Round',
      total: 'Total',
      addPlayer: 'Add Player',
      newRound: 'New Round',
      history: 'History',
      endSession: 'End Session',
      endSessionConfirm: 'Are you sure you want to end this session?',

      // Player Management
      playerName: 'Player Name',
      playerNamePlaceholder: 'Enter player name',
      removePlayer: 'Remove Player',
      removePlayerConfirm: 'Are you sure you want to remove this player?',

      // Round
      enterScore: 'Enter score',
      submitRound: 'Submit Round',
      scoreFor: 'Score for',
      zeroSum: 'Zero-Sum',
      free: 'Free',
      tapToChangeSign: 'Tap +/− to change sign, total must equal 0',
      tapToChangeSignFree: 'Tap +/− to change sign, any total allowed',
      totalLabel: 'Total:',
      mustEqualZero: 'Must equal 0 to save',
      totalMustBeZero: 'Total must be 0 (current: {total})',
      noActivePlayers: 'No active players',
      addPlayersToStart: 'Add players to start recording rounds',
      noActivePlayersError: 'No active players to record scores for',
      loading: 'Loading...',
      active: 'Active',
      inactive: 'Inactive',
      players: 'Players',
      undoLastRound: 'Undo Last Round',
      undoLastRoundConfirm:
         'Are you sure you want to undo Round {roundNo}? This will reverse all score changes from the most recent round. This action cannot be reversed.',
      createSessionDescription: 'Create a new game session with 4 default players',

      // History
      noHistory: 'No history yet',
      startAddingRounds: 'Start adding rounds to see history here',
      undo: 'Undo',
      note: 'Note:',

      // Errors
      error: 'Error',
      errorLoadingSession: 'Error loading session',
      errorCreatingSession: 'Error creating session',
      errorAddingPlayer: 'Error adding player',
      errorRemovingPlayer: 'Error removing player',
      errorAddingRound: 'Error adding round',
      loadingSession: 'Loading session...',

      // Success
      sessionCreated: 'Session created',
      sessionEnded: 'Session ended',
      playerAdded: 'Player added',
      playerRemoved: 'Player removed',
      playerRenamed: 'Player renamed',
      roundAdded: 'Round added',
      undoSuccess: 'Undo successful',

      // Validation
      playerNameEmpty: 'Player name cannot be empty',
      errorRenamingPlayer: 'Failed to rename player',
   },
   vi: {
      // Common
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Sửa',
      back: 'Quay lại',
      close: 'Đóng',

      // Navigation
      sessions: 'Phiên',
      stats: 'Thống kê',

      // Path/PWD
      'pwd.home': 'trang chủ',

      // Settings
      settings: 'Cài đặt',
      language: 'Ngôn ngữ',
      theme: 'Giao diện',
      general: 'Chung',

      // Languages
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt',

      // Themes
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống',

      // Session List
      scoreTracker: 'Ghi Điểm',
      newSession: 'Phiên mới',
      noSessions: 'Chưa có phiên nào',
      createFirstSession: 'Tạo phiên đầu tiên để bắt đầu ghi điểm',
      enterSessionName: 'Nhập tên phiên...',
      creating: 'Đang tạo...',
      deleteSession: 'Xóa phiên',
      deleteSessionConfirm:
         'Bạn có chắc muốn xóa "{name}"? Điều này sẽ xóa vĩnh viễn tất cả người chơi, vòng chơi và điểm số. Hành động này không thể hoàn tác.',
      errorDeletingSession: 'Lỗi xóa phiên',

      // Session Dashboard
      round: 'Vòng',
      total: 'Tổng',
      addPlayer: 'Thêm người chơi',
      newRound: 'Vòng mới',
      history: 'Lịch sử',
      endSession: 'Kết thúc phiên',
      endSessionConfirm: 'Bạn có chắc chắn muốn kết thúc phiên này?',

      // Player Management
      playerName: 'Tên người chơi',
      playerNamePlaceholder: 'Nhập tên người chơi',
      removePlayer: 'Xóa người chơi',
      removePlayerConfirm: 'Bạn có chắc chắn muốn xóa người chơi này?',

      // Round
      enterScore: 'Nhập điểm',
      submitRound: 'Ghi điểm',
      scoreFor: 'Điểm cho',
      zeroSum: 'Tổng bằng 0',
      free: 'Tự do',
      tapToChangeSign: 'Nhấn +/− để đổi dấu, tổng phải bằng 0',
      tapToChangeSignFree: 'Nhấn +/− để đổi dấu, tổng tùy ý',
      totalLabel: 'Tổng:',
      mustEqualZero: 'Phải bằng 0 để lưu',
      totalMustBeZero: 'Tổng phải bằng 0 (hiện tại: {total})',
      noActivePlayers: 'Không có người chơi nào',
      addPlayersToStart: 'Thêm người chơi để bắt đầu ghi điểm',
      noActivePlayersError: 'Không có người chơi nào để ghi điểm',
      loading: 'Đang tải...',
      active: 'Đang chơi',
      inactive: 'Không chơi',
      players: 'Người chơi',
      undoLastRound: 'Hoàn tác vòng cuối',
      undoLastRoundConfirm:
         'Bạn có chắc muốn hoàn tác Vòng {roundNo}? Điều này sẽ đảo ngược tất cả thay đổi điểm từ vòng gần nhất. Hành động này không thể hoàn tác.',
      createSessionDescription: 'Tạo phiên chơi mới với 4 người chơi mặc định',

      // History
      noHistory: 'Chưa có lịch sử',
      startAddingRounds: 'Bắt đầu thêm vòng để xem lịch sử tại đây',
      undo: 'Hoàn tác',
      note: 'Ghi chú:',

      // Errors
      error: 'Lỗi',
      errorLoadingSession: 'Lỗi tải phiên',
      errorCreatingSession: 'Lỗi tạo phiên',
      errorAddingPlayer: 'Lỗi thêm người chơi',
      errorRemovingPlayer: 'Lỗi xóa người chơi',
      errorAddingRound: 'Lỗi thêm vòng',
      loadingSession: 'Đang tải phiên...',

      // Success
      sessionCreated: 'Đã tạo phiên',
      sessionEnded: 'Phiên đã kết thúc',
      playerAdded: 'Đã thêm người chơi',
      playerRemoved: 'Đã xóa người chơi',
      playerRenamed: 'Đã đổi tên người chơi',
      roundAdded: 'Đã thêm vòng',
      undoSuccess: 'Hoàn tác thành công',

      // Validation
      playerNameEmpty: 'Tên người chơi không được để trống',
      errorRenamingPlayer: 'Lỗi đổi tên người chơi',
   },
};

export type TranslationKey = keyof typeof translations.en;
