{
  'targets': [
    {
      'target_name': 'blsct',
      'include_dirs': [
         '../../navio-core/src/bls/include',
         '../../navio-core/src/bls/mcl/include',
         '../../navio-core/src',
      ],
      'libraries': [
        '../../../lib/libblsct.a',
        '../../../lib/libbls384_256.a',
        '../../../lib/libmcl.a',
        '../../../lib/libunivalue_blsct.a',
      ],
      'sources': [
        'blsct_wrap.cxx',
      ],
      'cflags_cc': ['-std=c++20 -fPIC -fexceptions'],
      'xcode_settings': {
        'CLANG_CXX_LANGUAGE_STANDARD': 'c++20 -fexceptions',
        'OTHER_CFLAGS': ['-std=c++20 -fexceptios'],
        'OTHER_CPLUSPLUSFLAGS': ['-std=c++20', '-fexceptions']
      },
    }
  ]
}
